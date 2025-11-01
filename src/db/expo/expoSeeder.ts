import convert from "convert-units"
import { sql } from "drizzle-orm"
import type { useSQLiteContext } from "expo-sqlite"
import { DateTime } from "luxon"

import type __state from "../../data/data.json"
import _state from "../../data/data_large.json"
import { schema } from "../schema"
import { DrizzleDBType } from "../useDB"

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

const state = _state as typeof __state as {
  exerciseStore: {
    exercises: Array<{
      guid: string
      name: string
      images: string[]
      equipment: string[]
      instructions: string[]
      tips: string[]
      muscleAreas: string[]
      muscles: string[]
      measurements: Record<string, any>
      isFavorite: boolean
    }>
  }
}

// Configuration for generated workouts
const numberOfWorkouts = 20
const weightIncrementKg = 2.5
const setDuration = 100 * 1000
const rest = 300 * 1000

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

  const today = DateTime.fromISO(DateTime.now().toISODate()!)
  const exerciseList = state.exerciseStore.exercises

  const benchPressExercise = exerciseList.find((e) => e.name?.toLowerCase().includes("bench press"))
  const squatExercise = exerciseList.find((e) => e.name?.toLowerCase().includes("squat"))
  const cardioExercise = exerciseList.find((e) => e.muscleAreas?.includes("Cardio"))

  for (let i = 0; i < numberOfWorkouts; i++) {
    const workoutDate = today
      .minus({ days: i + i * Math.ceil(Math.random() * 2) })
      .set({ hour: 0, minute: 0, second: 0 })
    const workoutDateMs = workoutDate.toMillis()

    let workoutTime = workoutDate.set({ hour: 8, minute: 0, second: 0 })

    const insertWorkoutQuery = await drizzleDB
      .insert(workouts)
      .values({
        date: workoutDateMs,
        notes: Array.from({ length: between(0, 20) })
          .map(() => "word")
          .join(" ")
          .trim(),
        rpe: between(0, 1) ? between(5, 10) : null,
        pain: (["pain", "discomfort", "noPain", null] as const)[between(0, 3)],
        is_template: false,
      })
      .execute()
      .catch((err) => {
        console.error("insert workouts", err)
        throw err
      })
    const workoutId = insertWorkoutQuery.lastInsertRowId
    console.log({ workoutId })

    const numSteps = between(3, 8)

    for (let stepIndex = 0; stepIndex < numSteps; stepIndex++) {
      const stepTypeRoll = Math.random()
      let stepExercises: typeof exerciseList
      let isSuperSet = false

      if (stepTypeRoll < 0.1 && benchPressExercise && squatExercise) {
        stepExercises = [benchPressExercise, squatExercise]
        isSuperSet = true
      } else if (stepTypeRoll < 0.2 && benchPressExercise) {
        stepExercises = [benchPressExercise]
      } else if (stepTypeRoll < 0.3 && cardioExercise) {
        stepExercises = [cardioExercise]
      } else {
        const randomExercise = exerciseList[between(0, exerciseList.length - 1)]
        stepExercises = [randomExercise]
      }

      const workout_step_obj: typeof workout_steps.$inferInsert = {
        step_type: isSuperSet ? "superset" : "plain",
        workout_id: workoutId,
        position: stepIndex,
      }

      const runResult = await drizzleDB
        .insert(workout_steps)
        .values(workout_step_obj)
        .catch((err) => {
          console.log({ err, obj: workout_step_obj })
          throw err
        })
      const workoutStepId = runResult!.lastInsertRowId

      for (const exercise of stepExercises) {
        const exerciseId = exerciseList.indexOf(exercise) + 1
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

      const isCardio = stepExercises[0] === cardioExercise
      const numSets = isSuperSet ? between(2, 3) * 2 : between(2, 5)

      const groupSets: (typeof sets.$inferInsert)[] = []

      for (let setIndex = 0; setIndex < numSets; setIndex++) {
        const exercise = isSuperSet ? stepExercises[setIndex % 2] : stepExercises[0]
        const exerciseId = exerciseList.indexOf(exercise) + 1

        const restMs = setIndex > 0 ? rest : 0
        workoutTime = workoutTime.plus({
          milliseconds: restMs + setDuration,
        })

        if (isCardio) {
          // Cardio set
          const km = between(1, 3)
          const duration = km * between(4, 7)
          groupSets.push({
            workout_step_id: workoutStepId,
            exercise_id: exerciseId,
            reps: null,
            weight_mcg: null,
            duration_ms: convert(duration).from("min").to("ms"),
            distance_mm: convert(km).from("km").to("mm"),
            rest_ms: restMs,
            is_warmup: false,
            date: workoutDateMs,
            is_weak_ass_record: false,
            completed_at: null,
          })
        } else {
          const hasWeight = "weight" in exercise.measurements
          groupSets.push({
            workout_step_id: workoutStepId,
            exercise_id: exerciseId,
            reps: between(3, 12),
            weight_mcg: hasWeight
              ? convert(between(8, 40) * weightIncrementKg)
                  .from("kg")
                  .to("mcg")
              : null,
            duration_ms: null,
            distance_mm: null,
            rest_ms: restMs,
            is_warmup: setIndex === 0 || (isSuperSet && setIndex === 1),
            date: workoutDateMs,
            is_weak_ass_record: false,
            completed_at: null,
          })
        }
      }

      await drizzleDB.insert(sets).values(groupSets)
    }
  }
  console.log("added workouts")
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
  const tables = [
    schema.settings,
    schema.exercises,
    schema.exercise_metrics,
    schema.workouts,
    schema.workout_steps,
    schema.workout_step_exercises,
    schema.sets,
    schema.tags,
    schema.workouts_tags,
    schema.workout_steps_tags,
    schema.sets_tags,
    schema.exercises_tags,
  ]

  return Promise.all(
    tables.map((table) =>
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
