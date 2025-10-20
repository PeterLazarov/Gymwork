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

// CREATE VIEW public.exercise_records AS
//  WITH exercise_measurement_types AS (
//          SELECT exercise_metrics.exercise_id,
//             array_agg(exercise_metrics.measurement_type) AS measurement_types
//            FROM public.exercise_metrics
//           GROUP BY exercise_metrics.exercise_id
//         ), measurement_sets AS (
//          SELECT ws.id,
//             ws.exercise_id,
//             ws.reps,
//             ws.weight_mcg,
//             ws.distance_mm,
//             ws.duration_ms,
//             ws.speed_kph,
//             ws.date,
//             emt.measurement_types,
//                 CASE
//                     WHEN '{weight}' THEN ws.weight_mcg
//                     WHEN '{duration}' THEN (ws.duration_ms)
//                     WHEN '{reps}' THEN (ws.reps)
//                     WHEN '{distance}' THEN (ws.distance_mm)
//                     WHEN '{weight,duration}' THEN ws.weight_mcg
//                     WHEN '{reps,weight}' THEN (ws.reps)
//                     WHEN '{duration,reps}' THEN (ws.duration_ms)
//                     WHEN '{weight,distance}' THEN ws.weight_mcg
//                     WHEN '{distance,duration}' THEN (ws.distance_mm)
//                     WHEN '{reps,distance}' THEN (ws.reps)
//                     ELSE NULL
//                 END AS grouping_value,
//                 CASE
//                     WHEN '{weight}' THEN ws.weight_mcg
//                     WHEN '{duration}' THEN ((- ws.duration_ms))
//                     WHEN '{reps}' THEN (ws.reps)
//                     WHEN '{distance}' THEN (ws.distance_mm)
//                     WHEN '{weight,duration}' THEN ((- ws.duration_ms))
//                     WHEN '{reps,weight}' THEN ws.weight_mcg
//                     WHEN '{duration,reps}' THEN (ws.reps)
//                     WHEN '{weight,distance}' THEN (ws.distance_mm)
//                     WHEN '{distance,duration}' THEN ((- ws.duration_ms))
//                     WHEN '{reps,distance}' THEN (ws.distance_mm)
//                     ELSE NULL
//                 END AS measurement_value,
//                 CASE
//                     WHEN '{weight}' THEN 'weight'
//                     WHEN '{duration}' THEN 'duration'
//                     WHEN '{reps}' THEN 'reps'
//                     WHEN '{distance}' THEN 'distance'
//                     WHEN '{weight,duration}' THEN 'duration'
//                     WHEN '{reps,weight}' THEN 'weight'
//                     WHEN '{duration,reps}' THEN 'reps'
//                     WHEN '{weight,distance}' THEN 'distance'
//                     WHEN '{distance,duration}' THEN 'duration'
//                     WHEN '{reps,distance}' THEN 'distance'
//                     ELSE NULL
//                 END AS measuring_metric_type
//            FROM (public.sets ws
//              JOIN exercise_measurement_types emt ON ((ws.exercise_id = emt.exercise_id)))
//           WHERE (ws.is_warmup = false)
//         ), ranked_sets AS (
//          SELECT ms.id,
//             ms.exercise_id,
//             ms.reps,
//             ms.weight_mcg,
//             ms.distance_mm,
//             ms.duration_ms,
//             ms.speed_kph,
//             ms.date,
//             ms.measurement_types,
//             ms.grouping_value,
//             ms.measurement_value,
//             ms.measuring_metric_type,
//             em.more_is_better,
//             row_number() OVER (PARTITION BY ms.exercise_id, ms.grouping_value ORDER BY
//                 CASE
//                     WHEN em.more_is_better THEN ms.measurement_value
//                     ELSE (- ms.measurement_value)
//                 END DESC, ms.date DESC) AS rank
//            FROM (measurement_sets ms
//              LEFT JOIN public.exercise_metrics em ON (((ms.exercise_id = em.exercise_id) AND (ms.measuring_metric_type = (em.measurement_type)))))
//         )
//  SELECT id AS record_id,
//     exercise_id,
//     reps,
//     weight_mcg,
//     distance_mm,
//     duration_ms,
//     speed_kph,
//     date,
//     grouping_value,
//     measurement_value
//    FROM ranked_sets
//   WHERE (rank = 1)
//   ORDER BY exercise_id, grouping_value;

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
          SELECT exercise_metrics.exercise_id,
             array_agg(exercise_metrics.measurement_type) AS measurement_types
            FROM ${exercise_metrics}
           GROUP BY exercise_metrics.exercise_id
         ), measurement_sets AS (
          SELECT ws.id,
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
                     WHEN emt.measurement_types = 'distance' THEN (ws.distance_mm)
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
            FROM (${sets} ws
              JOIN exercise_measurement_types emt ON ((ws.exercise_id = emt.exercise_id)))
           WHERE (ws.is_warmup = false)
         ), ranked_sets AS (
          SELECT ms.id,
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
             row_number() OVER (PARTITION BY ms.exercise_id, ms.grouping_value ORDER BY
                 CASE
                     WHEN em.more_is_better THEN ms.measurement_value
                     ELSE (- ms.measurement_value)
                 END DESC, ms.date DESC) AS rank
            FROM (measurement_sets ms
              LEFT JOIN public.exercise_metrics em ON (((ms.exercise_id = em.exercise_id) AND (ms.measuring_metric_type = (em.measurement_type)))))
         )
  SELECT id AS record_id,
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
   WHERE (rank = 1)
   ORDER BY exercise_id, grouping_value;
`)

// export const exercise_records = sqliteView("exercise_records").as((qb) => {
//   return qb
//     .$with("exercise_measurement_types")
//     .as(
//       qb
//         .select({
//           exercise_id: exercise_metrics.exercise_id,
//           measurement_types:
//             sql<string>`group_concat(${exercise_metrics.measurement_type})`.as(
//               "measurement_types",
//             ),
//         })
//         .from(exercise_metrics)
//         .groupBy(exercise_metrics.exercise_id),
//     )
//     .$with("measurement_sets")
//     .as((qb) =>
//       qb
//         .select({
//           id: sets.id,
//           exercise_id: sets.exercise_id,
//           reps: sets.reps,
//           weight_mcg: sets.weight_mcg,
//           distance_mm: sets.distance_mm,
//           duration_ms: sets.duration_ms,
//           speed_kph: sets.speed_kph,
//           date: sets.date,
//           measurement_types: sql<string>`emt.measurement_types`,
//           // Determine grouping value based on measurement type combination
//           grouping_value: sql<number>`
//             CASE
//               WHEN emt.measurement_types = 'weight' THEN ${sets.weight_mcg}
//               WHEN emt.measurement_types = 'duration' THEN ${sets.duration_ms}
//               WHEN emt.measurement_types = 'reps' THEN ${sets.reps}
//               WHEN emt.measurement_types = 'distance' THEN ${sets.distance_mm}
//               WHEN emt.measurement_types IN ('weight,duration', 'duration,weight') THEN ${sets.weight_mcg}
//               WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ${sets.reps}
//               WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ${sets.duration_ms}
//               WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ${sets.weight_mcg}
//               WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN ${sets.distance_mm}
//               WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ${sets.reps}
//               ELSE NULL
//             END
//           `.as("grouping_value"),
//           // Determine measurement value (what we're optimizing for)
//           measurement_value: sql<number>`
//             CASE
//               WHEN emt.measurement_types = 'weight' THEN ${sets.weight_mcg}
//               WHEN emt.measurement_types = 'duration' THEN -${sets.duration_ms}
//               WHEN emt.measurement_types = 'reps' THEN ${sets.reps}
//               WHEN emt.measurement_types = 'distance' THEN ${sets.distance_mm}
//               WHEN emt.measurement_types IN ('weight,duration', 'duration,weight') THEN -${sets.duration_ms}
//               WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN ${sets.weight_mcg}
//               WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN ${sets.reps}
//               WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN ${sets.distance_mm}
//               WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN -${sets.duration_ms}
//               WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN ${sets.distance_mm}
//               ELSE NULL
//             END
//           `.as("measurement_value"),
//           measuring_metric_type: sql<string>`
//             CASE
//               WHEN emt.measurement_types = 'weight' THEN 'weight'
//               WHEN emt.measurement_types = 'duration' THEN 'duration'
//               WHEN emt.measurement_types = 'reps' THEN 'reps'
//               WHEN emt.measurement_types = 'distance' THEN 'distance'
//               WHEN emt.measurement_types IN ('weight,duration', 'duration,weight') THEN 'duration'
//               WHEN emt.measurement_types IN ('reps,weight', 'weight,reps') THEN 'weight'
//               WHEN emt.measurement_types IN ('duration,reps', 'reps,duration') THEN 'reps'
//               WHEN emt.measurement_types IN ('weight,distance', 'distance,weight') THEN 'distance'
//               WHEN emt.measurement_types IN ('distance,duration', 'duration,distance') THEN 'duration'
//               WHEN emt.measurement_types IN ('reps,distance', 'distance,reps') THEN 'distance'
//               ELSE NULL
//             END
//           `.as("measuring_metric_type"),
//         })
//         .from(sets)
//         .innerJoin(
//           sql`exercise_measurement_types emt`,
//           sql`${sets.exercise_id} = emt.exercise_id`,
//         )
//         .where(sql`${sets.is_warmup} = 0`),
//     )
//     .$with("ranked_sets")
//     .as((qb) =>
//       qb
//         .select({
//           id: sql`ms.id`,
//           exercise_id: sql`ms.exercise_id`,
//           reps: sql`ms.reps`,
//           weight_mcg: sql`ms.weight_mcg`,
//           distance_mm: sql`ms.distance_mm`,
//           duration_ms: sql`ms.duration_ms`,
//           speed_kph: sql`ms.speed_kph`,
//           date: sql`ms.date`,
//           measurement_types: sql`ms.measurement_types`,
//           grouping_value: sql`ms.grouping_value`,
//           measurement_value: sql`ms.measurement_value`,
//           measuring_metric_type: sql`ms.measuring_metric_type`,
//           more_is_better: exercise_metrics.more_is_better,
//           rank: sql<number>`
//             ROW_NUMBER() OVER (
//               PARTITION BY ms.exercise_id, ms.grouping_value
//               ORDER BY
//                 CASE
//                   WHEN ${exercise_metrics.more_is_better} = 1 THEN ms.measurement_value
//                   ELSE -ms.measurement_value
//                 END DESC,
//                 ms.date DESC
//             )
//           `.as("rank"),
//         })
//         .from(sql`measurement_sets ms`)
//         .leftJoin(
//           exercise_metrics,
//           sql`ms.exercise_id = ${exercise_metrics.exercise_id} AND ms.measuring_metric_type = ${exercise_metrics.measurement_type}`,
//         ),
//     )
//     .select({
//       record_id: sql`id`,
//       exercise_id: sql`exercise_id`,
//       reps: sql`reps`,
//       weight_mcg: sql`weight_mcg`,
//       distance_mm: sql`distance_mm`,
//       duration_ms: sql`duration_ms`,
//       speed_kph: sql`speed_kph`,
//       date: sql`date`,
//       grouping_value: sql`grouping_value`,
//       measurement_value: sql`measurement_value`,
//     })
//     .from(sql`ranked_sets`)
//     .where(sql`rank = 1`)
//     .orderBy(sql`exercise_id, grouping_value`)
// })

/**
 * Muscle Area Stats View
 * Shows workout count and percentage for each muscle area.
 */

// CREATE VIEW public.muscle_area_stats AS
//  WITH workout_muscle_areas AS (
//          SELECT DISTINCT w.id AS workout_id,
//             unnest(e.muscle_areas) AS muscle_area
//            FROM (((public.workouts w
//              JOIN public.workout_steps ws ON ((ws.workout_id = w.id)))
//              JOIN public.workout_step_exercises wse ON ((wse.workout_step_id = ws.id)))
//              JOIN public.exercises e ON ((e.id = wse.exercise_id)))
//         ), total_workouts AS (
//          SELECT count(*) AS count
//            FROM public.workouts
//         )
//  SELECT wma.muscle_area,
//     count(DISTINCT wma.workout_id) AS workout_count,
//     round((((count(DISTINCT wma.workout_id))::numeric / (tw.count)::numeric) * (100)::numeric), 2) AS percentage,
//     tw.count AS total_workouts
//    FROM (workout_muscle_areas wma
//      CROSS JOIN total_workouts tw)
//   GROUP BY wma.muscle_area, tw.count
//   ORDER BY (round((((count(DISTINCT wma.workout_id))::numeric / (tw.count)::numeric) * (100)::numeric), 2)) DESC;
// export const muscle_area_stats = sqliteView("muscle_area_stats").as((qb) => {
//   return qb
//     .$with("workout_muscle_areas")
//     .as(
//       qb
//         .selectDistinct({
//           workout_id: workouts.id,
//           muscle_area: sql<string>`json_each.value`.as("muscle_area"),
//         })
//         .from(workouts)
//         .innerJoin(workout_steps, sql`${workout_steps.workout_id} = ${workouts.id}`)
//         .innerJoin(
//           workout_step_exercises,
//           sql`${workout_step_exercises.workout_step_id} = ${workout_steps.id}`,
//         )
//         .innerJoin(exercises, sql`${exercises.id} = ${workout_step_exercises.exercise_id}`)
//         .innerJoin(
//           sql`json_each(${exercises.muscle_areas})`,
//           sql`1=1`, // Always true, just for joining
//         )
//         .where(sql`${workouts.is_template} = 0`),
//     )
//     .$with("total_workouts")
//     .as(
//       qb
//         .select({
//           count: sql<number>`COUNT(*)`.as("count"),
//         })
//         .from(workouts)
//         .where(sql`${workouts.is_template} = 0`),
//     )
//     .select({
//       muscle_area: sql<string>`wma.muscle_area`,
//       workout_count: sql<number>`COUNT(DISTINCT wma.workout_id)`.as("workout_count"),
//       percentage: sql<number>`ROUND(
//         (CAST(COUNT(DISTINCT wma.workout_id) AS REAL) / CAST(tw.count AS REAL)) * 100,
//         2
//       )`.as("percentage"),
//       total_workouts: sql<number>`tw.count`.as("total_workouts"),
//     })
//     .from(sql`workout_muscle_areas wma`)
//     .crossJoin(sql`total_workouts tw`)
//     .groupBy(sql`wma.muscle_area, tw.count`)
//     .orderBy(sql`percentage DESC`)
// })

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
  // muscle_area_stats,
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

// export type SelectMuscleAreaStat = typeof muscle_area_stats.$inferSelect
