import { relations } from "drizzle-orm"

import {
  record_calculation_configs,
  exercises,
  equipment,
  exercise_equipment,
  muscles,
  exercise_muscles,
  muscle_areas,
  exercise_muscle_areas,
  discomfort_logs,
  metrics,
  exercise_metrics,
  workout_templates,
  workouts,
  workout_templates_to_set_group_templates,
  workout_templates_tags,
  set_group_templates,
  set_templates,
  set_groups,
  set_group_templates_tags,
  sets,
  set_templates_tags,
  workouts_tags,
  set_groups_tags,
  sets_tags,
  exercises_tags,
  tags,
} from "./schema"

// Record calculation configs relations
export const recordCalculationConfigsRelations = relations(
  record_calculation_configs,
  ({ many }) => ({
    exercises: many(exercises),
  }),
)

// Equipment relations
export const equipmentRelations = relations(equipment, ({ many }) => ({
  exerciseEquipment: many(exercise_equipment),
}))

// Muscles relations
export const musclesRelations = relations(muscles, ({ many }) => ({
  exerciseMuscles: many(exercise_muscles),
}))

// Muscle areas relations
export const muscleAreasRelations = relations(muscle_areas, ({ many }) => ({
  exerciseMuscleAreas: many(exercise_muscle_areas),
  discomfortLogs: many(discomfort_logs),
}))

// Metrics relations
export const metricsRelations = relations(metrics, ({ many }) => ({
  exerciseMetrics: many(exercise_metrics),
}))

// Workout templates relations
export const workoutTemplatesRelations = relations(workout_templates, ({ many }) => ({
  workouts: many(workouts),
  workoutTemplatesToSetGroupTemplates: many(workout_templates_to_set_group_templates),
  workoutTemplatesTags: many(workout_templates_tags),
}))

// Set group templates relations
export const setGroupTemplatesRelations = relations(set_group_templates, ({ many }) => ({
  setTemplates: many(set_templates),
  setGroups: many(set_groups),
  workoutTemplatesToSetGroupTemplates: many(workout_templates_to_set_group_templates),
  setGroupTemplatesTags: many(set_group_templates_tags),
}))

// Workout templates to set group templates relations
export const workoutTemplatesToSetGroupTemplatesRelations = relations(
  workout_templates_to_set_group_templates,
  ({ one }) => ({
    workoutTemplate: one(workout_templates, {
      fields: [workout_templates_to_set_group_templates.workout_template_id],
      references: [workout_templates.id],
    }),
    setGroupTemplate: one(set_group_templates, {
      fields: [workout_templates_to_set_group_templates.set_group_template_id],
      references: [set_group_templates.id],
    }),
  }),
)

// Set templates relations
export const setTemplatesRelations = relations(set_templates, ({ one, many }) => ({
  setGroupTemplate: one(set_group_templates, {
    fields: [set_templates.set_group_template_id],
    references: [set_group_templates.id],
  }),
  exercise: one(exercises, {
    fields: [set_templates.exercise_id],
    references: [exercises.id],
  }),
  sets: many(sets),
  setTemplatesTags: many(set_templates_tags),
}))

// Workouts relations
export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  template: one(workout_templates, {
    fields: [workouts.template_id],
    references: [workout_templates.id],
  }),
  setGroups: many(set_groups),
  discomfortLogs: many(discomfort_logs),
  workoutsTags: many(workouts_tags),
}))

// Set groups relations
export const setGroupsRelations = relations(set_groups, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [set_groups.workout_id],
    references: [workouts.id],
  }),
  template: one(set_group_templates, {
    fields: [set_groups.template_id],
    references: [set_group_templates.id],
  }),
  sets: many(sets),
  setGroupsTags: many(set_groups_tags),
}))

// Sets relations
export const setsRelations = relations(sets, ({ one, many }) => ({
  setGroup: one(set_groups, {
    fields: [sets.set_group_id],
    references: [set_groups.id],
  }),
  exercise: one(exercises, {
    fields: [sets.exercise_id],
    references: [exercises.id],
  }),
  template: one(set_templates, {
    fields: [sets.template_id],
    references: [set_templates.id],
  }),
  discomfortLogs: many(discomfort_logs),
  setsTags: many(sets_tags),
}))

// Exercises relations
export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  recordConfig: one(record_calculation_configs, {
    fields: [exercises.record_config_id],
    references: [record_calculation_configs.id],
  }),
  exerciseMetrics: many(exercise_metrics),
  exerciseEquipment: many(exercise_equipment),
  exerciseMuscles: many(exercise_muscles),
  exerciseMuscleAreas: many(exercise_muscle_areas),
  setTemplates: many(set_templates),
  sets: many(sets),
  exercisesTags: many(exercises_tags),
}))

// Exercise metrics relations
export const exerciseMetricsRelations = relations(exercise_metrics, ({ one }) => ({
  metric: one(metrics, {
    fields: [exercise_metrics.metric_id],
    references: [metrics.id],
  }),
  exercise: one(exercises, {
    fields: [exercise_metrics.exercise_id],
    references: [exercises.id],
  }),
}))

// Exercise equipment relations
export const exerciseEquipmentRelations = relations(exercise_equipment, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exercise_equipment.exercise_id],
    references: [exercises.id],
  }),
  equipment: one(equipment, {
    fields: [exercise_equipment.equipment_id],
    references: [equipment.id],
  }),
}))

// Exercise muscles relations
export const exerciseMusclesRelations = relations(exercise_muscles, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exercise_muscles.exercise_id],
    references: [exercises.id],
  }),
  muscle: one(muscles, {
    fields: [exercise_muscles.muscle_id],
    references: [muscles.id],
  }),
}))

// Exercise muscle areas relations
export const exerciseMuscleAreasRelations = relations(exercise_muscle_areas, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exercise_muscle_areas.exercise_id],
    references: [exercises.id],
  }),
  muscleArea: one(muscle_areas, {
    fields: [exercise_muscle_areas.muscle_area_id],
    references: [muscle_areas.id],
  }),
}))

// Discomfort logs relations
export const discomfortLogsRelations = relations(discomfort_logs, ({ one }) => ({
  workout: one(workouts, {
    fields: [discomfort_logs.workout_id],
    references: [workouts.id],
  }),
  set: one(sets, {
    fields: [discomfort_logs.set_id],
    references: [sets.id],
  }),
  muscleArea: one(muscle_areas, {
    fields: [discomfort_logs.muscle_area_id],
    references: [muscle_areas.id],
  }),
}))

// Tags relations
export const tagsRelations = relations(tags, ({ many }) => ({
  workoutTemplatesTags: many(workout_templates_tags),
  setGroupTemplatesTags: many(set_group_templates_tags),
  setTemplatesTags: many(set_templates_tags),
  workoutsTags: many(workouts_tags),
  setGroupsTags: many(set_groups_tags),
  setsTags: many(sets_tags),
  exercisesTags: many(exercises_tags),
}))

// Workout templates tags relations
export const workoutTemplatesTagsRelations = relations(workout_templates_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [workout_templates_tags.tag_id],
    references: [tags.id],
  }),
  workoutTemplate: one(workout_templates, {
    fields: [workout_templates_tags.entity_id],
    references: [workout_templates.id],
  }),
}))

// Set group templates tags relations
export const setGroupTemplatesTagsRelations = relations(set_group_templates_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [set_group_templates_tags.tag_id],
    references: [tags.id],
  }),
  setGroupTemplate: one(set_group_templates, {
    fields: [set_group_templates_tags.entity_id],
    references: [set_group_templates.id],
  }),
}))

// Set templates tags relations
export const setTemplatesTagsRelations = relations(set_templates_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [set_templates_tags.tag_id],
    references: [tags.id],
  }),
  setTemplate: one(set_templates, {
    fields: [set_templates_tags.entity_id],
    references: [set_templates.id],
  }),
}))

// Workouts tags relations
export const workoutsTagsRelations = relations(workouts_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [workouts_tags.tag_id],
    references: [tags.id],
  }),
  workout: one(workouts, {
    fields: [workouts_tags.entity_id],
    references: [workouts.id],
  }),
}))

// Set groups tags relations
export const setGroupsTagsRelations = relations(set_groups_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [set_groups_tags.tag_id],
    references: [tags.id],
  }),
  setGroup: one(set_groups, {
    fields: [set_groups_tags.entity_id],
    references: [set_groups.id],
  }),
}))

// Sets tags relations
export const setsTagsRelations = relations(sets_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [sets_tags.tag_id],
    references: [tags.id],
  }),
  set: one(sets, {
    fields: [sets_tags.entity_id],
    references: [sets.id],
  }),
}))

// Exercises tags relations
export const exercisesTagsRelations = relations(exercises_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [exercises_tags.tag_id],
    references: [tags.id],
  }),
  exercise: one(exercises, {
    fields: [exercises_tags.entity_id],
    references: [exercises.id],
  }),
}))

export const allRelations = {
  equipmentRelations,
  musclesRelations,
  muscleAreasRelations,
  metricsRelations,
  workoutTemplatesRelations,
  setGroupTemplatesRelations,
  workoutTemplatesToSetGroupTemplatesRelations,
  setTemplatesRelations,
  workoutsRelations,
  setGroupsRelations,
  setsRelations,
  exercisesRelations,
  exerciseMetricsRelations,
  exerciseEquipmentRelations,
  exerciseMusclesRelations,
  exerciseMuscleAreasRelations,
  discomfortLogsRelations,
  tagsRelations,
  recordCalculationConfigsRelations,
  workoutTemplatesTagsRelations,
  setGroupTemplatesTagsRelations,
  setTemplatesTagsRelations,
  workoutsTagsRelations,
  setGroupsTagsRelations,
  setsTagsRelations,
  exercisesTagsRelations,
}
export type AllRelations = typeof allRelations
