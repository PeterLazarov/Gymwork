import { sql } from "drizzle-orm"

import { DrizzleDBType } from "@/src/db/useDB"

import type { useSQLiteContext } from "expo-sqlite"
import type __state from "../../data/data.json"
import _state from "../../data/data_large.json"
import { schema } from "../schema"
import { DateTime } from "luxon"

const {
  // workouts
  workouts,
  workout_steps,
  sets,
  workout_step_exercises,

  // exercises
  exercises,
  exercise_metrics,

  // tags
  tags,
  workouts_tags,
  workout_steps_tags,
  sets_tags,
  exercises_tags,
} = schema

const state = _state as typeof __state

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// assuming `state` is imported or passed in
export async function seedAll(drizzleDB: DrizzleDBType) {
  // Insert exercises with their data as JSON arrays
  for (const e of state.exerciseStore.exercises) {
    const _exercise: typeof exercises.$inferInsert = {
      name: e.name,
      is_favorite: false,
      tips: e.tips,
      instructions: e.instructions,
      images: e.images,
      equipment: e.equipment,
      muscles: e.muscles,
      muscle_areas: e.muscleAreas,
      position: null,
      stance: null,
    }

    const exerciseInsertQuery = await drizzleDB
      .insert(exercises)
      .values(_exercise)
      .execute()
      .catch((err) => {
        console.error("ex", err)
        throw err
      })
    const exerciseId = exerciseInsertQuery!.lastInsertRowId

    // Insert exercise metrics
    if ("weight" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "weight",
          unit: "kg",
          more_is_better: true,
          step_value: 2.5,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics weight", err)
          throw err
        })
    }
    if ("reps" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "reps",
          unit: "count",
          more_is_better: true,
          step_value: 1,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics reps", err)
          throw err
        })
    }
    if ("duration" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "duration",
          unit: "ms",
          more_is_better: false, // Less time is usually better for duration
          step_value: 1000,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics duration", err)
          throw err
        })
    }
    if ("distance" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "distance",
          unit: "mm",
          more_is_better: true,
          step_value: 1000,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics distance", err)
          throw err
        })
    }

    console.log("inserted exercise ", exerciseId)
  }
  console.log("added exercises")

  for (const workout of state.workoutStore.workouts) {
    const cleanedDate = DateTime.fromISO(workout.date).set({ hour: 0, minute: 0, second: 0 })
    const workoutDate = cleanedDate.toMillis()
    const insertWorkoutQuery = await drizzleDB
      .insert(workouts)
      .values({
        date: workoutDate,
        notes: workout.notes,
        rpe: workout.rpe,
        pain: workout.pain,
        is_template: false,
      })
      .execute()
      .catch((err) => {
        console.error("insert workouts", err)
        throw err
      })
    const workoutId = insertWorkoutQuery.lastInsertRowId
    console.log({ workoutId })

    for (let stepIndex = 0; stepIndex < workout.steps.length; stepIndex++) {
      const workout_step_obj: typeof workout_steps.$inferInsert = {
        step_type: "plain" as const,
        workout_id: workoutId,
        position: stepIndex,
      }

      // ! this times out on web sometimes
      const runResult = await drizzleDB
        .insert(workout_steps)
        .values(workout_step_obj)
        .catch((err) => {
          console.log({
            err,
            obj: workout_step_obj,
          })
        })
      const workoutStepId = runResult!.lastInsertRowId

      const step = workout.steps[stepIndex]

      // Get the exercise IDs for this step
      const exerciseIds = new Set<number>()
      for (const set of step.sets) {
        const exerciseIndex = state.exerciseStore.exercises.findIndex(
          (e) => e.guid === set.exercise,
        )
        if (exerciseIndex !== -1) {
          exerciseIds.add(exerciseIndex + 1)
        }
      }

      // Insert workout_step_exercises for each unique exercise in this step
      for (const exerciseId of exerciseIds) {
        await drizzleDB
          .insert(workout_step_exercises)
          .values({
            workout_step_id: workoutStepId,
            exercise_id: exerciseId,
          })
          .execute()
          .catch((err) => {
            console.error("insert workout_step_exercises", err)
            throw err
          })
      }

      const groupSets = step.sets.map((set, i) => ({
        workout_step_id: workoutStepId,
        exercise_id: state.exerciseStore.exercises.findIndex((e) => e.guid === set.exercise)! + 1,
        reps: "reps" in set ? set.reps : null,
        weight_mcg: "weightMcg" in set ? set.weightMcg : null,
        duration_ms: "durationMs" in set ? set.durationMs : null,
        distance_mm: "distanceMm" in set ? set.distanceMm : null,
        rest_ms: "restMs" in set ? set.restMs : null,
        is_warmup: set.isWarmup,
        date: workoutDate, // Denormalized for easier querying
        is_weak_ass_record: false,
        completed_at: null,
      }))

      await drizzleDB.insert(sets).values(groupSets)
    }
  }
}

export async function dropAllTables(db: DrizzleDBType) {
  await db.transaction(async (tx) => {
    // 1. fetch all non-system tables
    const tables: { name: string }[] = await tx.all(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
    )

    // 2. drop each one
    for (const { name } of tables) {
      await tx.run(
        // identifier() safely quotes the table name
        sql`DROP TABLE IF EXISTS ${sql.identifier(name)};`,
      )
    }
  })
}

export async function clearAll(db: DrizzleDBType, sqlite: ReturnType<typeof useSQLiteContext>) {
  return Promise.all(
    Object.values(schema).map((table) =>
      db
        .delete(table)
        .execute()
        .catch((err) => {
          console.error(err)
          throw err
        }),
    ),
  )

  // dropAllTables(db)
}
