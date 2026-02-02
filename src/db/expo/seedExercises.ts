import { schema, type InsertExercise } from "../schema"
import type { DrizzleDBType } from "../useDB"

import _data from "./exercises.json"

const { exercises, exercise_metrics } = schema

export type ExerciseSeedData = {
  exercise: InsertExercise
  measurements: {
    weight: boolean
    reps: boolean
    duration: boolean
    distance: boolean
    speed: boolean
  }
}

type PrecomputedExercise = {
  name: string
  images: string[]
  equipment: string[]
  instructions: string[]
  tips: string[] | null
  muscles: string[]
  muscle_areas: string[]
  position: string | null
  stance: string | null
  is_favorite: boolean
  measurements: {
    weight: boolean
    reps: boolean
    duration: boolean
    speed: boolean
    distance: boolean
  }
}

const data = _data as PrecomputedExercise[]

export const exerciseSeedData: ExerciseSeedData[] = data.map(
  ({ measurements, ...exercise }) => ({
    exercise,
    measurements,
  }),
)

export async function seedExercises(drizzleDB: DrizzleDBType) {
  const allExercises = exerciseSeedData.map(({ exercise }) => exercise)
  await drizzleDB
    .insert(exercises)
    .values(allExercises)
    .execute()
    .catch((err) => {
      console.error("batch insert exercises", err)
      throw err
    })

  const insertedExercises = await drizzleDB.query.exercises.findMany({
    columns: { id: true, name: true },
  })

  const exerciseNameToId = new Map(insertedExercises.map((e) => [e.name, e.id]))

  const allMetrics: (typeof exercise_metrics.$inferInsert)[] = []

  for (const { exercise, measurements } of exerciseSeedData) {
    const exerciseId = exerciseNameToId.get(exercise.name)
    if (!exerciseId) continue

    if (measurements.weight) {
      allMetrics.push({
        exercise_id: exerciseId,
        measurement_type: "weight",
        unit: "kg",
        more_is_better: true,
        step_value: 2.5,
        min_value: 0,
        max_value: null,
      })
    }
    if (measurements.reps) {
      allMetrics.push({
        exercise_id: exerciseId,
        measurement_type: "reps",
        unit: "reps",
        more_is_better: true,
        step_value: 1,
        min_value: 0,
        max_value: null,
      })
    }
    if (measurements.duration) {
      allMetrics.push({
        exercise_id: exerciseId,
        measurement_type: "duration",
        unit: "ms",
        more_is_better: false,
        step_value: 1000,
        min_value: 0,
        max_value: null,
      })
    }
    if (measurements.distance) {
      allMetrics.push({
        exercise_id: exerciseId,
        measurement_type: "distance",
        unit: "mm",
        more_is_better: true,
        step_value: 1000,
        min_value: 0,
        max_value: null,
      })
    }
  }

  if (allMetrics.length > 0) {
    await drizzleDB
      .insert(exercise_metrics)
      .values(allMetrics)
      .execute()
      .catch((err) => {
        console.error("batch insert metrics", err)
        throw err
      })
  }

  console.log(`✅ Added ${allExercises.length} exercises with ${allMetrics.length} metrics`)
  
  return exerciseSeedData
}
