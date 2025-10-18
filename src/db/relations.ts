import { relations } from "drizzle-orm"

import {
  exercise_measurements,
  exercises,
  exercises_tags,
  tags,
  workout_sets,
  workout_sets_tags,
  workout_step_exercises,
  workout_steps,
  workout_steps_tags,
  workouts,
  workouts_tags,
} from "./schema"

// Exercises relations
export const exercisesRelations = relations(exercises, ({ many }) => ({
  exerciseMeasurements: many(exercise_measurements),
  workoutStepExercises: many(workout_step_exercises),
  workoutSets: many(workout_sets),
  exercisesTags: many(exercises_tags),
}))

// Exercise measurements relations
export const exerciseMeasurementsRelations = relations(exercise_measurements, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exercise_measurements.exercise_id],
    references: [exercises.id],
  }),
}))

// Workouts relations
export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutSteps: many(workout_steps),
  workoutsTags: many(workouts_tags),
}))

// Workout steps relations
export const workoutStepsRelations = relations(workout_steps, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workout_steps.workout_id],
    references: [workouts.id],
  }),
  workoutStepExercises: many(workout_step_exercises),
  workoutStepsTags: many(workout_steps_tags),
}))

// Workout step exercises relations
export const workoutStepExercisesRelations = relations(workout_step_exercises, ({ one }) => ({
  workoutStep: one(workout_steps, {
    fields: [workout_step_exercises.workout_step_id],
    references: [workout_steps.id],
  }),
  exercise: one(exercises, {
    fields: [workout_step_exercises.exercise_id],
    references: [exercises.id],
  }),
}))

// Workout sets relations
export const workoutSetsRelations = relations(workout_sets, ({ one, many }) => ({
  exercise: one(exercises, {
    fields: [workout_sets.exercise_id],
    references: [exercises.id],
  }),
  workoutSetsTags: many(workout_sets_tags),
}))

// Tags relations
export const tagsRelations = relations(tags, ({ many }) => ({
  workoutsTags: many(workouts_tags),
  workoutStepsTags: many(workout_steps_tags),
  workoutSetsTags: many(workout_sets_tags),
  exercisesTags: many(exercises_tags),
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

// Workout steps tags relations
export const workoutStepsTagsRelations = relations(workout_steps_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [workout_steps_tags.tag_id],
    references: [tags.id],
  }),
  workoutStep: one(workout_steps, {
    fields: [workout_steps_tags.entity_id],
    references: [workout_steps.id],
  }),
}))

// Workout sets tags relations
export const workoutSetsTagsRelations = relations(workout_sets_tags, ({ one }) => ({
  tag: one(tags, {
    fields: [workout_sets_tags.tag_id],
    references: [tags.id],
  }),
  workoutSet: one(workout_sets, {
    fields: [workout_sets_tags.entity_id],
    references: [workout_sets.id],
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
  exercisesRelations,
  exerciseMeasurementsRelations,
  workoutsRelations,
  workoutStepsRelations,
  workoutStepExercisesRelations,
  workoutSetsRelations,
  tagsRelations,
  workoutsTagsRelations,
  workoutStepsTagsRelations,
  workoutSetsTagsRelations,
  exercisesTagsRelations,
}

export type AllRelations = typeof allRelations
