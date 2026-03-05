import { eq } from "drizzle-orm"
import { DateTime } from "luxon"

import { navigate } from "@/navigators/navigationUtilities"
import { schema } from "../schema"
import type { DrizzleDBType } from "../useDB"

const { workouts, workout_steps, workout_step_exercises } = schema

type SeedResult = {
  navigate: () => void
}

async function insertWorkoutForToday(db: DrizzleDBType): Promise<number> {
  const result = await db
    .insert(workouts)
    .values({
      date: DateTime.fromISO(DateTime.now().toISODate()!).toMillis(),
      is_template: false,
    })
    .execute()
  return result.lastInsertRowId
}

/**
 * Creates a workout for today with "Abdominal Crunches Machine" as a step.
 */
async function seedWorkoutWithStep(db: DrizzleDBType): Promise<SeedResult> {
  const exercise = await db.query.exercises.findFirst({
    where: eq(schema.exercises.name, "Abdominal Crunches Machine"),
    columns: { id: true },
  })
  if (!exercise) throw new Error("Seed exercise 'Abdominal Crunches Machine' not found")

  const workoutId = await insertWorkoutForToday(db)

  const stepResult = await db
    .insert(workout_steps)
    .values({
      workout_id: workoutId,
      step_type: "plain",
      position: 0,
    })
    .execute()

  await db
    .insert(workout_step_exercises)
    .values({
      workout_step_id: stepResult.lastInsertRowId,
      exercise_id: exercise.id,
    })
    .execute()

  return { navigate: () => navigate("Workout") }
}

/**
 * Navigates to ExerciseSelect without seeding data
 * (the workout is created lazily by the app on exercise selection).
 */
async function seedExerciseSelect(_db: DrizzleDBType): Promise<SeedResult> {
  return { navigate: () => navigate("ExerciseSelect", { selectMode: "plain" }) }
}

/**
 * Navigates to ExerciseEdit in create mode (no existing exercise).
 */
async function seedCreateExercise(_db: DrizzleDBType): Promise<SeedResult> {
  return { navigate: () => navigate("ExerciseEdit") }
}

export type TestSeedPreset = "workout-with-step" | "exercise-select" | "create-exercise"

const presets: Record<TestSeedPreset, (db: DrizzleDBType) => Promise<SeedResult>> = {
  "workout-with-step": seedWorkoutWithStep,
  "exercise-select": seedExerciseSelect,
  "create-exercise": seedCreateExercise,
}

export function getTestSeedPreset(name: string) {
  return presets[name as TestSeedPreset]
}
