import { sql } from "drizzle-orm"
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  SQLiteTableWithColumns,
  sqliteView,
  text
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
  images: text({ mode: "json" }).$type<string[]>().default(sql`'[]'`),
  equipment: text({ mode: "json" }).$type<string[]>().default(sql`'[]'`),
  muscle_areas: text({ mode: "json" }).$type<string[]>().default(sql`'[]'`),
  muscles: text({ mode: "json" }).$type<string[]>().default(sql`'[]'`),
  instructions: text({ mode: "json" }).$type<string[]>().default(sql`'[]'`),
  tips: text({ mode: "json" }).$type<string[]>(),

  position: text(),
  stance: text(),

  is_favorite: integer({ mode: "boolean" }).notNull().default(false),

  created_at: timestamp_col,
  updated_at: timestamp_col,
})

export const exercise_measurements = sqliteTable("exercise_measurements", {
  id: integer().primaryKey({ autoIncrement: true }),
  exercise_id: integer()
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),

  measurement_type: text({ enum: ["weight", "duration", "reps", "distance", "speed", "rest"] }).notNull(),
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
export const workout_sets = sqliteTable("workout_sets", {
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
export const workout_sets_tags = getEntityTagTable("workout_sets", workout_sets)
export const exercises_tags = getEntityTagTable("exercises", exercises)

// Views

/**
 * Exercise Records View
 * Calculates personal records for each exercise based on their measurement types.
 * Groups by the first metric and measures by the second metric.
 */
export const exercise_records = sqliteView("exercise_records").as((qb) => {
  return qb
    .$with("exercise_measurement_types")
    .as(
      qb
        .select({
          exercise_id: exercise_measurements.exercise_id,
          measurement_types: sql<string>`group_concat(${exercise_measurements.measurement_type})`.as(
            "measurement_types",
          ),
        })
        .from(exercise_measurements)
        .groupBy(exercise_measurements.exercise_id),
    )
    .$with("measurement_sets")
    .as((qb) =>
      qb
        .select({
          id: workout_sets.id,
          exercise_id: workout_sets.exercise_id,
          reps: workout_sets.reps,
          weight_mcg: workout_sets.weight_mcg,
          distance_mm: workout_sets.distance_mm,
          duration_ms: workout_sets.duration_ms,
          speed_kph: workout_sets.speed_kph,
          date: workout_sets.date,
          measurement_types: sql<string>`emt.measurement_types`,
          // Determine grouping value based on measurement type combination
          grouping_value: sql<number>`
            CASE
              WHEN emt.measurement_types = 'weight' THEN ${workout_sets.weight_mcg}
              WHEN emt.measurement_types = 'duration' THEN ${workout_sets.duration_ms}
              WHEN emt.measurement_types = 'reps' THEN ${workout_sets.reps}
              WHEN emt.measurement_types = 'distance' THEN ${workout_sets.distance_mm}
              WHEN emt.measurement_types IN ('weight,duration', 'duration,weight') THEN ${workout_sets.weight_mcg}
              WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ${workout_sets.reps}
              WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ${workout_sets.duration_ms}
              WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ${workout_sets.weight_mcg}
              WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN ${workout_sets.distance_mm}
              WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ${workout_sets.reps}
              ELSE NULL
            END
          `.as("grouping_value"),
          // Determine measurement value (what we're optimizing for)
          measurement_value: sql<number>`
            CASE
              WHEN emt.measurement_types = 'weight' THEN ${workout_sets.weight_mcg}
              WHEN emt.measurement_types = 'duration' THEN -${workout_sets.duration_ms}
              WHEN emt.measurement_types = 'reps' THEN ${workout_sets.reps}
              WHEN emt.measurement_types = 'distance' THEN ${workout_sets.distance_mm}
              WHEN emt.measurement_types IN ('weight,duration', 'duration,weight') THEN -${workout_sets.duration_ms}
              WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ${workout_sets.weight_mcg}
              WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ${workout_sets.reps}
              WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ${workout_sets.distance_mm}
              WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN -${workout_sets.duration_ms}
              WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ${workout_sets.distance_mm}
              ELSE NULL
            END
          `.as("measurement_value"),
          measuring_metric_type: sql<string>`
            CASE
              WHEN emt.measurement_types = 'weight' THEN 'weight'
              WHEN emt.measurement_types = 'duration' THEN 'duration'
              WHEN emt.measurement_types = 'reps' THEN 'reps'
              WHEN emt.measurement_types = 'distance' THEN 'distance'
              WHEN emt.measurement_types IN ('weight,duration', 'duration,weight') THEN 'duration'
              WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN 'weight'
              WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN 'reps'
              WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN 'distance'
              WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN 'duration'
              WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN 'distance'
              ELSE NULL
            END
          `.as("measuring_metric_type"),
        })
        .from(workout_sets)
        .innerJoin(
          sql`exercise_measurement_types emt`,
          sql`${workout_sets.exercise_id} = emt.exercise_id`,
        )
        .where(sql`${workout_sets.is_warmup} = 0`),
    )
    .$with("ranked_sets")
    .as((qb) =>
      qb
        .select({
          id: sql`ms.id`,
          exercise_id: sql`ms.exercise_id`,
          reps: sql`ms.reps`,
          weight_mcg: sql`ms.weight_mcg`,
          distance_mm: sql`ms.distance_mm`,
          duration_ms: sql`ms.duration_ms`,
          speed_kph: sql`ms.speed_kph`,
          date: sql`ms.date`,
          measurement_types: sql`ms.measurement_types`,
          grouping_value: sql`ms.grouping_value`,
          measurement_value: sql`ms.measurement_value`,
          measuring_metric_type: sql`ms.measuring_metric_type`,
          more_is_better: exercise_measurements.more_is_better,
          rank: sql<number>`
            ROW_NUMBER() OVER (
              PARTITION BY ms.exercise_id, ms.grouping_value
              ORDER BY
                CASE
                  WHEN ${exercise_measurements.more_is_better} = 1 THEN ms.measurement_value
                  ELSE -ms.measurement_value
                END DESC,
                ms.date DESC
            )
          `.as("rank"),
        })
        .from(sql`measurement_sets ms`)
        .leftJoin(
          exercise_measurements,
          sql`ms.exercise_id = ${exercise_measurements.exercise_id} AND ms.measuring_metric_type = ${exercise_measurements.measurement_type}`,
        ),
    )
    .select({
      record_id: sql`id`,
      exercise_id: sql`exercise_id`,
      reps: sql`reps`,
      weight_mcg: sql`weight_mcg`,
      distance_mm: sql`distance_mm`,
      duration_ms: sql`duration_ms`,
      speed_kph: sql`speed_kph`,
      date: sql`date`,
      grouping_value: sql`grouping_value`,
      measurement_value: sql`measurement_value`,
    })
    .from(sql`ranked_sets`)
    .where(sql`rank = 1`)
    .orderBy(sql`exercise_id, grouping_value`)
})

/**
 * Muscle Area Stats View
 * Shows workout count and percentage for each muscle area.
 */
export const muscle_area_stats = sqliteView("muscle_area_stats").as((qb) => {
  return qb
    .$with("workout_muscle_areas")
    .as(
      qb
        .selectDistinct({
          workout_id: workouts.id,
          muscle_area: sql<string>`json_each.value`.as("muscle_area"),
        })
        .from(workouts)
        .innerJoin(workout_steps, sql`${workout_steps.workout_id} = ${workouts.id}`)
        .innerJoin(
          workout_step_exercises,
          sql`${workout_step_exercises.workout_step_id} = ${workout_steps.id}`,
        )
        .innerJoin(exercises, sql`${exercises.id} = ${workout_step_exercises.exercise_id}`)
        .innerJoin(
          sql`json_each(${exercises.muscle_areas})`,
          sql`1=1`, // Always true, just for joining
        )
        .where(sql`${workouts.is_template} = 0`),
    )
    .$with("total_workouts")
    .as(
      qb
        .select({
          count: sql<number>`COUNT(*)`.as("count"),
        })
        .from(workouts)
        .where(sql`${workouts.is_template} = 0`),
    )
    .select({
      muscle_area: sql<string>`wma.muscle_area`,
      workout_count: sql<number>`COUNT(DISTINCT wma.workout_id)`.as("workout_count"),
      percentage: sql<number>`ROUND(
        (CAST(COUNT(DISTINCT wma.workout_id) AS REAL) / CAST(tw.count AS REAL)) * 100,
        2
      )`.as("percentage"),
      total_workouts: sql<number>`tw.count`.as("total_workouts"),
    })
    .from(sql`workout_muscle_areas wma`)
    .crossJoin(sql`total_workouts tw`)
    .groupBy(sql`wma.muscle_area, tw.count`)
    .orderBy(sql`percentage DESC`)
})

export const schema = {
  // settings
  settings,

  // exercises
  exercises,
  exercise_measurements,

  // workouts
  workouts,
  workout_steps,
  workout_step_exercises,
  workout_sets,

  // tags
  tags,
  workouts_tags,
  workout_steps_tags,
  workout_sets_tags,
  exercises_tags,

  // views
  exercise_records,
  muscle_area_stats,
}

// Types

// Settings
export type SelectSettings = typeof settings.$inferSelect
export type InsertSettings = typeof settings.$inferInsert

// Exercises
export type SelectExercise = typeof exercises.$inferSelect
export type InsertExercise = typeof exercises.$inferInsert

export type SelectExerciseMeasurement = typeof exercise_measurements.$inferSelect
export type InsertExerciseMeasurement = typeof exercise_measurements.$inferInsert

// Workouts
export type SelectWorkout = typeof workouts.$inferSelect
export type InsertWorkout = typeof workouts.$inferInsert

export type SelectWorkoutStep = typeof workout_steps.$inferSelect
export type InsertWorkoutStep = typeof workout_steps.$inferInsert

export type SelectWorkoutStepExercise = typeof workout_step_exercises.$inferSelect
export type InsertWorkoutStepExercise = typeof workout_step_exercises.$inferInsert

export type SelectWorkoutSet = typeof workout_sets.$inferSelect
export type InsertWorkoutSet = typeof workout_sets.$inferInsert

// Tags
export type SelectTag = typeof tags.$inferSelect
export type InsertTag = typeof tags.$inferInsert

export type SelectWorkoutTag = typeof workouts_tags.$inferSelect
export type InsertWorkoutTag = typeof workouts_tags.$inferInsert

export type SelectWorkoutStepTag = typeof workout_steps_tags.$inferSelect
export type InsertWorkoutStepTag = typeof workout_steps_tags.$inferInsert

export type SelectWorkoutSetTag = typeof workout_sets_tags.$inferSelect
export type InsertWorkoutSetTag = typeof workout_sets_tags.$inferInsert

export type SelectExerciseTag = typeof exercises_tags.$inferSelect
export type InsertExerciseTag = typeof exercises_tags.$inferInsert

// Views
export type SelectExerciseRecord = typeof exercise_records.$inferSelect

export type SelectMuscleAreaStat = typeof muscle_area_stats.$inferSelect
