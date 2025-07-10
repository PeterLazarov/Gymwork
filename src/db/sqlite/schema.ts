import { sql } from "drizzle-orm"
import {
  integer,
  primaryKey,
  sqliteTable,
  SQLiteTableWithColumns,
  text,
} from "drizzle-orm/sqlite-core"

import { METRICS, ALL_UNITS } from "./constants"

// TODO

const timestamp_col_default_time_sql = () =>
  sql`(strftime('%s','now')*1000 + cast(substr(strftime('%f','now'),4,3) as integer))`

// ms precision
const timestamp_col = integer().notNull().default(timestamp_col_default_time_sql())

// second precision
// const isoDateTimeCol = text().default(sql`CURRENT TIMESTAMP`)

// Configs & Mostly constant data
export const record_calculation_configs = sqliteTable("record_calculation_configs", {
  id: integer().primaryKey(),

  measurement_column: text({ enum: METRICS }),
  measurement_sort_direction: text({ enum: ["asc", "desc"] })
    .notNull()
    .default("desc"),

  grouping_column: text({ enum: METRICS }),
  grouping_sort_direction: text({ enum: ["asc", "desc"] })
    .notNull()
    .default("desc"),
})

export const equipment = sqliteTable("equipment", {
  id: text().primaryKey(),
  name: text().notNull(),
})

export const muscles = sqliteTable("muscles", {
  id: text().primaryKey(),
  name: text().notNull(),
})

export const muscle_areas = sqliteTable("muscle_areas", {
  id: text().primaryKey(),
  name: text().notNull(),
})

// weight, duration, distance, reps, rest
export const metrics = sqliteTable("metrics", {
  id: text({ enum: METRICS }).primaryKey(), // e.g. 'weight_mcg' TODO units in name?
  display_name: text().notNull(), // e.g. 'Weight'
  unit: text({ enum: ALL_UNITS }).notNull(), // e.g. 'kg'
  round_to: integer().notNull(), // e.g. 5000
})

// Templates

export const workout_templates = sqliteTable("workout_templates", {
  id: text().primaryKey(),

  name: text().notNull(),
  notes: text(),

  created_at: timestamp_col,
})

// Does it have to be a part of a workout?
export const set_group_templates = sqliteTable("set_group_templates", {
  id: text().primaryKey(),

  name: text().notNull(),
  type: text({ enum: ["plain", "superset", "circuit", "emom", "amrap", "custom"] }).notNull(),
  position: integer().notNull(),

  created_at: timestamp_col,
})

export const workout_templates_to_set_group_templates = sqliteTable(
  "workout_templates_to_set_group_templates",
  {
    workout_template_id: text()
      .notNull()
      .references(() => workout_templates.id, { onDelete: "cascade" }), // e.g. 'weight_mcg'
    set_group_template_id: text()
      .notNull()
      .references(() => set_group_templates.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.workout_template_id, t.set_group_template_id] })],
)

export const set_templates = sqliteTable("set_templates", {
  id: text().primaryKey(),
  set_group_template_id: text()
    .notNull() // should this really not be nullable?
    .references(() => set_group_templates.id, { onDelete: "cascade" }),
  exercise_id: text()
    .references(() => exercises.id, { onDelete: "restrict" })
    .notNull(), // references exercises.id

  name: text(),

  position: integer().notNull(), // position in set_group

  is_warmup: integer({ mode: "boolean" }).notNull().default(false),
  reps: integer(),
  weight_mcg: integer(),
  distance_mm: integer(),
  duration_ms: integer(),
  rest_ms: integer(),

  rpe: integer("rpe"), // 1-10

  created_at: timestamp_col,
})

// Execution (Logs / Performed)

export const workouts = sqliteTable("workouts", {
  id: text().primaryKey(),
  template_id: text().references(() => workout_templates.id, { onDelete: "set null" }),

  name: text(),
  notes: text(),

  scheduled_for: integer(),
  started_at: integer(),
  completed_at: integer(),
  created_at: timestamp_col,
})

// GROUPS (e.g., supersets, circuits)
export const set_groups = sqliteTable("set_groups", {
  id: text().primaryKey(),
  workout_id: text()
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  template_id: text().references(() => set_group_templates.id, { onDelete: "set null" }),

  name: text(),
  type: text({ enum: ["plain", "superset", "circuit", "emom", "amrap", "custom"] }).notNull(),
  position: integer().notNull(),

  started_at: integer(),
  completed_at: integer(),
  created_at: timestamp_col,
})

export const sets = sqliteTable("sets", {
  id: text().primaryKey(),
  set_group_id: text()
    .notNull()
    .references(() => set_groups.id, { onDelete: "cascade" }),
  exercise_id: text()
    .references(() => exercises.id)
    .notNull(), // references exercises.id
  template_id: text().references(() => set_templates.id, { onDelete: "restrict" }),

  position: integer().notNull(), // position in set_group

  is_warmup: integer({ mode: "boolean" }).notNull().default(false),
  reps: integer(),
  weight_mcg: integer(),
  distance_mm: integer(),
  duration_ms: integer(),
  rest_ms: integer(),

  rpe: integer("rpe"), // 1-10

  completed_at: integer(),

  // GymWork can do this via tags IMO, but maybe failure is good to capture?
  // But then again, we'll do that via different sets right?
  // fail one, complete another to designate which is planned and which accomplished?

  // hevy style
  // type: text({'warmup', 'normal', 'failure', 'drop'})

  // fitNotes status style
  // -completed_at
  // status: text({ enum: ['completed', 'failed', 'warmup'] })
  // status_changed_at: integer(),

  created_at: timestamp_col,
})

// Exercises

export const exercises = sqliteTable("exercises", {
  id: text().primaryKey(),

  name: text().notNull(),
  is_favorite: integer({ mode: "boolean" }).notNull().default(false),

  tips: text({ mode: "json" }).$type<string[]>(),
  instructions: text({ mode: "json" }).$type<string[]>(),
  images: text({ mode: "json" }).$type<string[]>(),

  record_config_id: integer()
    .notNull()
    .references(() => record_calculation_configs.id, { onDelete: "restrict" }),

  created_at: timestamp_col,
})

export const exercise_metrics = sqliteTable(
  "exercise_metrics",
  {
    metric_id: text({ enum: METRICS })
      .notNull()
      .references(() => metrics.id, { onDelete: "cascade" }), // e.g. 'weight_mcg'
    exercise_id: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.exercise_id, t.metric_id] })],
)

export const exercise_equipment = sqliteTable(
  "exercise_equipment",
  {
    exercise_id: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    equipment_id: text()
      .notNull()
      .references(() => equipment.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.exercise_id, t.equipment_id] })],
)

export const exercise_muscles = sqliteTable(
  "exercise_muscles",
  {
    exercise_id: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscle_id: text()
      .notNull()
      .references(() => muscles.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.exercise_id, t.muscle_id] })],
)

export const exercise_muscle_areas = sqliteTable(
  "exercise_muscle_areas",
  {
    exercise_id: text()
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscle_area_id: text()
      .notNull()
      .references(() => muscle_areas.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.exercise_id, t.muscle_area_id] })],
)

// Feedback / Health

export const discomfort_logs = sqliteTable(
  "discomfort_logs",
  {
    workout_id: text()
      // .notNull()
      .references(() => workouts.id, { onDelete: "set null" }),
    set_id: text().references(() => sets.id),
    // TODO rename to muscle area? or rename muscleArea to bodypart?
    muscle_area_id: text()
      // .notNull()
      .references(() => muscle_areas.id, { onDelete: "set null" }),
    severity: integer().notNull(), // e.g. 1–10 pain scale
    notes: text(), // optional freeform comment

    created_at: timestamp_col, // when user logged it
  },
  (t) => [primaryKey({ columns: [t.workout_id, t.muscle_area_id, t.created_at] })],
)

// Tags
export const tags = sqliteTable("tags", {
  id: text().primaryKey(),
  name: text().notNull(),
  category: text(), // optional: 'exercise', 'workout', 'set', etc.
  color: text(),

  created_at: timestamp_col,
})

function getEntityTagTable(tableName: string, table: SQLiteTableWithColumns<any>) {
  return sqliteTable(
    `${tableName.slice(0, -1)}_tags`,
    {
      tag_id: text()
        .notNull()
        .references(() => tags.id, { onDelete: "cascade" }),
      entity_id: text()
        .notNull()
        .references(() => table.id, { onDelete: "cascade" }),

      created_at: timestamp_col,
    },
    (t) => [primaryKey({ columns: [t.tag_id, t.entity_id] })],
  )
}

export const workout_templates_tags = getEntityTagTable("workout_templates", workout_templates)
export const set_group_templates_tags = getEntityTagTable(
  "set_group_templates",
  set_group_templates,
)
export const set_templates_tags = getEntityTagTable("set_templates", set_templates)

export const workouts_tags = getEntityTagTable("workouts", workouts)
export const set_groups_tags = getEntityTagTable("set_groups", set_groups)
export const sets_tags = getEntityTagTable("sets", sets)

export const exercises_tags = getEntityTagTable("exercises", exercises)

export const schema = {
  //  configs
  record_calculation_configs,
  equipment,
  muscles,
  muscle_areas,
  metrics,

  // templates
  workout_templates,
  set_group_templates,
  set_templates,

  // performed
  workouts,
  set_groups,
  sets,

  // exercises
  exercises,
  exercise_metrics,
  exercise_equipment,
  exercise_muscles,
  exercise_muscle_areas,

  // health
  discomfort_logs,

  // Tags
  tags,
  workout_templates_tags,
  set_group_templates_tags,
  set_templates_tags,
  workouts_tags,
  set_groups_tags,
  sets_tags,
  exercises_tags,

  workout_templates_set_group_templates: workout_templates_to_set_group_templates,
}

// Types

// Configs
export type SelectRecordCalculationConfig = typeof record_calculation_configs.$inferSelect
export type InsertRecordCalculationConfig = typeof record_calculation_configs.$inferInsert

export type SelectEquipment = typeof equipment.$inferSelect
export type InsertEquipment = typeof equipment.$inferInsert

export type SelectMuscle = typeof muscles.$inferSelect
export type InsertMuscle = typeof muscles.$inferInsert

export type SelectMuscleArea = typeof muscle_areas.$inferSelect
export type InsertMuscleArea = typeof muscle_areas.$inferInsert

export type SelectMetric = typeof metrics.$inferSelect
export type InsertMetric = typeof metrics.$inferInsert

// Templates
export type SelectTemplateWorkout = typeof workout_templates.$inferSelect
export type InsertTemplateWorkout = typeof workout_templates.$inferInsert

export type SelectTemplateSetGroup = typeof set_group_templates.$inferSelect
export type InsertTemplateSetGroup = typeof set_group_templates.$inferInsert

export type SelectTemplateSet = typeof set_templates.$inferSelect
export type InsertTemplateSet = typeof set_templates.$inferInsert

// Executed (Logs)
export type SelectWorkout = typeof workouts.$inferSelect
export type InsertWorkout = typeof workouts.$inferInsert

export type SelectSetGroup = typeof set_groups.$inferSelect
export type InsertSetGroup = typeof set_groups.$inferInsert

export type SelectSet = typeof sets.$inferSelect
export type InsertSet = typeof sets.$inferInsert

// Exercises
export type SelectExercise = typeof exercises.$inferSelect
export type InsertExercise = typeof exercises.$inferInsert

export type SelectExerciseMetric = typeof exercise_metrics.$inferSelect
export type InsertExerciseMetric = typeof exercise_metrics.$inferInsert

export type SelectExerciseEquipment = typeof exercise_equipment.$inferSelect
export type InsertExerciseEquipment = typeof exercise_equipment.$inferInsert

export type SelectExerciseMuscle = typeof exercise_muscles.$inferSelect
export type InsertExerciseMuscle = typeof exercise_muscles.$inferInsert

export type SelectExerciseMuscleArea = typeof exercise_muscle_areas.$inferSelect
export type InsertExerciseMuscleArea = typeof exercise_muscle_areas.$inferInsert

// Health
export type SelectDiscomfortLog = typeof discomfort_logs.$inferSelect
export type InsertDiscomfortLog = typeof discomfort_logs.$inferInsert

// Tags
export type SelectTag = typeof tags.$inferSelect
export type InsertTag = typeof tags.$inferInsert

export type SelectTemplateWorkoutTag = typeof workout_templates_tags.$inferSelect
export type InsertTemplateWorkoutTag = typeof workout_templates_tags.$inferInsert

export type SelectTemplateset_groupTag = typeof set_group_templates_tags.$inferSelect
export type InsertTemplateset_groupTag = typeof set_group_templates_tags.$inferInsert

export type SelectTemplateSetTag = typeof set_templates_tags.$inferSelect
export type InsertTemplateSetTag = typeof set_templates_tags.$inferInsert

export type SelectWorkoutTag = typeof workouts_tags.$inferSelect
export type InsertWorkoutTag = typeof workouts_tags.$inferInsert

export type Selectset_groupTag = typeof set_groups_tags.$inferSelect
export type Insertset_groupTag = typeof set_groups_tags.$inferInsert

export type SelectSetTag = typeof sets_tags.$inferSelect
export type InsertSetTag = typeof sets_tags.$inferInsert

export type SelectExerciseTag = typeof exercises_tags.$inferSelect
export type InsertExerciseTag = typeof exercises_tags.$inferInsert
