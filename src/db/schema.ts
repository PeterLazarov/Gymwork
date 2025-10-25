import { sql } from "drizzle-orm"
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  SQLiteTableWithColumns,
  sqliteView,
  text,
} from "drizzle-orm/sqlite-core"

const timestamp_col_default_time_sql = () =>
  sql`(strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer))`

// ms precision
const timestamp_col = integer().notNull().default(timestamp_col_default_time_sql())

// Configs & Settings
export const settings = sqliteTable("settings", {
  id: integer().primaryKey({ autoIncrement: true }),
  theme: text({ enum: ["light", "dark"] })
    .notNull()
    .default("light"),
  scientific_muscle_names_enabled: integer({ mode: "boolean" }).notNull().default(false),
  show_set_completion: integer({ mode: "boolean" }).notNull().default(true),
  preview_next_set: integer({ mode: "boolean" }).notNull().default(true),
  measure_rest: integer({ mode: "boolean" }).notNull().default(true),
  show_comments_card: integer({ mode: "boolean" }).notNull().default(true),
  show_workout_timer: integer({ mode: "boolean" }).notNull().default(true),
  created_at: timestamp_col,
  updated_at: timestamp_col,
})

// Exercises - Tuby structure
export const exercises = sqliteTable("exercises", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),

  // JSON arrays for related data
  images: text({ mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  equipment: text({ mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  muscle_areas: text({ mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  muscles: text({ mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  instructions: text({ mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  tips: text({ mode: "json" }).$type<string[]>(),

  position: text(),
  stance: text(),

  is_favorite: integer({ mode: "boolean" }).notNull().default(false),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

export const exercise_metrics = sqliteTable("exercise_metrics", {
  id: integer().primaryKey({ autoIncrement: true }),
  exercise_id: integer()
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),

  measurement_type: text({
    enum: ["weight", "duration", "reps", "distance", "speed", "rest"],
  }).notNull(),
  unit: text().notNull(), // e.g., 'kg', 'lb', 'ms', 'mm', 'kph'

  more_is_better: integer({ mode: "boolean" }).notNull().default(true),
  step_value: real(), // e.g., 2.5 for weight increments
  min_value: real(),
  max_value: real(),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

// Workouts - unified structure with is_template flag
export const workouts = sqliteTable("workouts", {
  id: integer().primaryKey({ autoIncrement: true }),

  name: text(),
  notes: text(),
  date: integer(), // date as timestamp

  feeling: text(),
  pain: text(),
  rpe: integer(), // 1-10

  ended_at: integer(),
  duration_ms: integer(),

  is_template: integer({ mode: "boolean" }).notNull().default(false),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

// Workout Steps (replaces set_groups)
export const workout_steps = sqliteTable("workout_steps", {
  id: integer().primaryKey({ autoIncrement: true }),
  workout_id: integer()
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),

  step_type: text({ enum: ["plain", "superset", "circuit", "emom", "amrap", "custom"] }).notNull(),
  position: integer().notNull(),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

// Join table for exercises in workout steps
export const workout_step_exercises = sqliteTable("workout_step_exercises", {
  id: integer().primaryKey({ autoIncrement: true }),
  workout_step_id: integer()
    .notNull()
    .references(() => workout_steps.id, { onDelete: "cascade" }),
  exercise_id: integer()
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

// Workout Sets (replaces sets)
export const sets = sqliteTable("sets", {
  id: integer().primaryKey({ autoIncrement: true }),
  workout_step_id: integer()
    .notNull()
    .references(() => workout_steps.id, { onDelete: "cascade" }),
  exercise_id: integer()
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),

  is_warmup: integer({ mode: "boolean" }).notNull().default(false),
  date: integer().notNull(), // denormalized for easier querying
  is_weak_ass_record: integer({ mode: "boolean" }).notNull().default(false),

  // Measurements
  reps: integer(),
  weight_mcg: integer(),
  distance_mm: integer(),
  duration_ms: integer(),
  speed_kph: real(),
  rest_ms: integer(),

  completed_at: integer(),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

// Tags
export const tags = sqliteTable("tags", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  category: text(), // optional: 'exercise', 'workout', 'set', etc.
  color: text(),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

function getEntityTagTable(tableName: string, table: SQLiteTableWithColumns<any>) {
  return sqliteTable(
    `${tableName.slice(0, -1)}_tags`,
    {
      tag_id: integer()
        .notNull()
        .references(() => tags.id, { onDelete: "cascade" }),
      entity_id: integer()
        .notNull()
        .references(() => table.id, { onDelete: "cascade" }),

      created_at: timestamp_col,
      updated_at: timestamp_col,
    },
    (t) => [primaryKey({ columns: [t.tag_id, t.entity_id] })],
  )
}

export const workouts_tags = getEntityTagTable("workouts", workouts)
export const workout_steps_tags = getEntityTagTable("workout_steps", workout_steps)
export const sets_tags = getEntityTagTable("sets", sets)
export const exercises_tags = getEntityTagTable("exercises", exercises)

// Views

/**
 * Exercise Records View
 * Calculates personal records for each exercise based on their measurement types.
 * Groups by the first metric and measures by the second metric.
 */

const exercise_records = sqliteView("exercise_records", {
  record_id: integer()
    .notNull()
    .references(() => sets.id),
  exercise_id: integer()
    .notNull()
    .references(() => exercises.id),
  reps: integer(),
  weight_mcg: integer(),
  distance_mm: integer(),
  duration_ms: integer(),
  speed_kph: real(),
  date: integer().notNull(),
  grouping_value: integer().notNull(),
  measurement_value: integer().notNull(),
}).as(sql`
  WITH exercise_measurement_types AS (
    SELECT
      exercise_metrics.exercise_id,
      group_concat(exercise_metrics.measurement_type) AS measurement_types
    FROM ${exercise_metrics}
    GROUP BY exercise_metrics.exercise_id
  ),
  measurement_sets AS (
    SELECT
      ws.id,
      ws.exercise_id,
      ws.reps,
      ws.weight_mcg,
      ws.distance_mm,
      ws.duration_ms,
      ws.speed_kph,
      ws.date,
      emt.measurement_types,
      CASE
        WHEN emt.measurement_types = 'weight' THEN ws.weight_mcg
        WHEN emt.measurement_types = 'duration' THEN ws.duration_ms
        WHEN emt.measurement_types = 'reps' THEN ws.reps
        WHEN emt.measurement_types = 'distance' THEN ws.distance_mm
        WHEN emt.measurement_types IN ('weight,duration','duration,weight') THEN ws.weight_mcg
        WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ws.reps
        WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ws.duration_ms
        WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ws.weight_mcg
        WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN ws.distance_mm
        WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ws.reps
        ELSE NULL
      END AS grouping_value,
      CASE
        WHEN emt.measurement_types = 'weight' THEN ws.weight_mcg
        WHEN emt.measurement_types = 'duration' THEN ws.duration_ms
        WHEN emt.measurement_types = 'reps' THEN ws.reps
        WHEN emt.measurement_types = 'distance' THEN ws.distance_mm
        WHEN emt.measurement_types IN ('weight,duration','duration,weight') THEN ws.duration_ms
        WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ws.weight_mcg
        WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ws.reps
        WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ws.distance_mm
        WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN ws.duration_ms
        WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ws.distance_mm
        ELSE NULL
      END AS measurement_value,
      CASE
        WHEN emt.measurement_types = 'weight' THEN 'weight'
        WHEN emt.measurement_types = 'duration' THEN 'duration'
        WHEN emt.measurement_types = 'reps' THEN 'reps'
        WHEN emt.measurement_types = 'distance' THEN 'distance'
        WHEN emt.measurement_types IN ('weight,duration','duration,weight') THEN 'duration'
        WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN 'weight'
        WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN 'reps'
        WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN 'distance'
        WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN 'duration'
        WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN 'distance'
        ELSE NULL
      END AS measuring_metric_type
    FROM ${sets} ws
    JOIN exercise_measurement_types emt ON ws.exercise_id = emt.exercise_id
    WHERE ws.is_warmup = 0
  ),
  ranked_sets AS (
    SELECT
      ms.id,
      ms.exercise_id,
      ms.reps,
      ms.weight_mcg,
      ms.distance_mm,
      ms.duration_ms,
      ms.speed_kph,
      ms.date,
      ms.measurement_types,
      ms.grouping_value,
      ms.measurement_value,
      ms.measuring_metric_type,
      em.more_is_better,
      row_number() OVER (
        PARTITION BY ms.exercise_id, ms.grouping_value
        ORDER BY
          CASE
            WHEN em.more_is_better THEN ms.measurement_value
            ELSE -ms.measurement_value
          END DESC,
          ms.date DESC
      ) AS rank
    FROM measurement_sets ms
    LEFT JOIN ${exercise_metrics} em
      ON ms.exercise_id = em.exercise_id
      AND ms.measuring_metric_type = em.measurement_type
  )
  SELECT
    id AS record_id,
    exercise_id,
    reps,
    weight_mcg,
    distance_mm,
    duration_ms,
    speed_kph,
    date,
    grouping_value,
    measurement_value
  FROM ranked_sets
  WHERE rank = 1
  ORDER BY exercise_id, grouping_value
`)

/**
 * Muscle Area Stats View
 * Shows workout count and percentage for each muscle area.
 */

const muscle_area_stats = sqliteView("muscle_area_stats", {
  muscle_area: text().notNull(),
  workout_count: integer().notNull(),
  percentage: real().notNull(),
  total_workouts: integer().notNull(),
}).as(sql`
  WITH workout_muscle_areas AS (
    SELECT DISTINCT
      w.id AS workout_id,
      json_each.value AS muscle_area
    FROM ${workouts} w
    INNER JOIN ${workout_steps} ws ON ws.workout_id = w.id
    INNER JOIN ${workout_step_exercises} wse ON wse.workout_step_id = ws.id
    INNER JOIN ${exercises} e ON e.id = wse.exercise_id
    INNER JOIN json_each(e.muscle_areas) ON 1=1
    WHERE w.is_template = 0
  ),
  total_workouts AS (
    SELECT COUNT(*) AS count
    FROM ${workouts}
    WHERE is_template = 0
  )
  SELECT
    wma.muscle_area,
    COUNT(DISTINCT wma.workout_id) AS workout_count,
    ROUND(
      (CAST(COUNT(DISTINCT wma.workout_id) AS REAL) / CAST(tw.count AS REAL)) * 100,
      2
    ) AS percentage,
    tw.count AS total_workouts
  FROM workout_muscle_areas wma
  CROSS JOIN total_workouts tw
  GROUP BY wma.muscle_area, tw.count
  ORDER BY percentage DESC
`)

export const schema = {
  // settings
  settings,

  // exercises
  exercises,
  exercise_metrics,

  // workouts
  workouts,
  workout_steps,
  workout_step_exercises,
  sets,

  // tags
  tags,
  workouts_tags,
  workout_steps_tags,
  sets_tags,
  exercises_tags,

  // views
  exercise_records,
  muscle_area_stats,
}

// Types

// Settings
export type Settings = typeof settings.$inferSelect
export type InsertSettings = typeof settings.$inferInsert

// Exercises
export type Exercise = typeof exercises.$inferSelect
export type InsertExercise = typeof exercises.$inferInsert

export type ExerciseMetric = typeof exercise_metrics.$inferSelect
export type InsertExerciseMetric = typeof exercise_metrics.$inferInsert

// Workouts
export type Workout = typeof workouts.$inferSelect
export type InsertWorkout = typeof workouts.$inferInsert

export type WorkoutStep = typeof workout_steps.$inferSelect
export type InsertWorkoutStep = typeof workout_steps.$inferInsert

export type WorkoutStepExercise = typeof workout_step_exercises.$inferSelect
export type InsertWorkoutStepExercise = typeof workout_step_exercises.$inferInsert

export type Set = typeof sets.$inferSelect
export type InsertSet = typeof sets.$inferInsert

// Tags
export type Tag = typeof tags.$inferSelect
export type InsertTag = typeof tags.$inferInsert

export type WorkoutTag = typeof workouts_tags.$inferSelect
export type InsertWorkoutTag = typeof workouts_tags.$inferInsert

export type WorkoutStepTag = typeof workout_steps_tags.$inferSelect
export type InsertWorkoutStepTag = typeof workout_steps_tags.$inferInsert

export type SetTag = typeof sets_tags.$inferSelect
export type InsertSetTag = typeof sets_tags.$inferInsert

export type ExerciseTag = typeof exercises_tags.$inferSelect
export type InsertExerciseTag = typeof exercises_tags.$inferInsert

// Views
export type ExerciseRecord = typeof exercise_records
export type MuscleAreaStat = typeof muscle_area_stats
