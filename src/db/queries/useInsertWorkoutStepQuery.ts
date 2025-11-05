import { count, eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { ExerciseModel } from "../models/ExerciseModel"
import { SetModel } from "../models/SetModel"
import { sets, workout_step_exercises, workout_steps } from "../schema"
import { useDB } from "../useDB"

type StepData = {
  id: number
  stepType: "plain" | "superset" | "circuit" | "emom" | "amrap" | "custom"
  position: number
  createdAt: number
  updatedAt: number
}

type InsertWorkoutStepParams = {
  workoutId: number
  exercises: ExerciseModel[]
  sets?: SetModel[]
  stepData?: StepData
}

export const useInsertWorkoutStepQuery = () => {
  const { drizzleDB } = useDB()

  return async ({ workoutId, exercises, sets: stepSets, stepData }: InsertWorkoutStepParams) => {
    const timestamp = DateTime.now().toMillis()
    let stepId: number | null = null

    if (stepData) {
      const insertResult = await drizzleDB
        .insert(workout_steps)
        .values({
          id: stepData.id,
          workout_id: workoutId,
          step_type: stepData.stepType,
          position: stepData.position,
          created_at: stepData.createdAt,
          updated_at: stepData.updatedAt,
        })
        .execute()

      stepId = insertResult.lastInsertRowId
    } else {
      const stepCountResult = await drizzleDB
        .select({ count: count() })
        .from(workout_steps)
        .where(eq(workout_steps.workout_id, workoutId))

      const nextPosition = stepCountResult[0].count + 1

      const insertResult = await drizzleDB
        .insert(workout_steps)
        .values({
          workout_id: workoutId,
          step_type: "plain",
          position: nextPosition,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .execute()

      stepId = insertResult.lastInsertRowId
    }

    if (exercises.length > 0) {
      await drizzleDB
        .insert(workout_step_exercises)
        .values(
          exercises.map((ex) => ({
            workout_step_id: stepId,
            exercise_id: ex.id!,
            created_at: stepData?.createdAt ?? timestamp,
            updated_at: stepData?.updatedAt ?? timestamp,
          })),
        )
        .execute()
    }

    if (stepSets && stepSets.length > 0) {
      await drizzleDB
        .insert(sets)
        .values(
          stepSets.map((set) => ({
            id: set.id,
            workout_step_id: set.workoutStepId,
            exercise_id: set.exerciseId,
            is_warmup: set.isWarmup,
            date: set.date,
            is_weak_ass_record: set.isWeakAssRecord,
            reps: set.reps,
            weight_mcg: set.weightMcg,
            distance_mm: set.distanceMm,
            duration_ms: set.durationMs,
            speed_kph: set.speedKph,
            rest_ms: set.restMs,
            completed_at: set.completedAt,
            created_at: set.createdAt,
            updated_at: set.updatedAt,
          })),
        )
        .execute()
    }

    return stepId
  }
}
