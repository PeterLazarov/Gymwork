import { WorkoutModel } from "../models/WorkoutModel"
import { sets, workout_step_exercises, workout_steps, workouts } from "../schema"
import { useDB } from "../useDB"

export const useWorkoutCopy = () => {
  const { drizzleDB } = useDB()
  return async (date: number, workout: WorkoutModel, includeSets: boolean): Promise<number> => {
    const insertWorkoutResult = await drizzleDB
      .insert(workouts)
      .values({
        date,
        name: workout.name,
        notes: workout.notes,
        feeling: workout.feeling,
        pain: workout.pain,
        rpe: workout.rpe,
        ended_at: workout.endedAt,
        duration_ms: workout.durationMs,
        is_template: false,
      })
      .execute()

    const newWorkoutId = insertWorkoutResult.lastInsertRowId as number

    for (const step of workout.workoutSteps) {
      const insertStepResult = await drizzleDB
        .insert(workout_steps)
        .values({
          workout_id: newWorkoutId,
          step_type: step.stepType,
          position: step.position,
        })
        .execute()

      const newStepId = insertStepResult.lastInsertRowId as number

      const exerciseIds = new Set(step.exercises.map((exercise) => exercise.id!))

      for (const exerciseId of exerciseIds) {
        await drizzleDB
          .insert(workout_step_exercises)
          .values({
            workout_step_id: newStepId,
            exercise_id: exerciseId,
          })
          .execute()
      }

      if (includeSets) {
        for (const set of step.sets) {
          await drizzleDB
            .insert(sets)
            .values({
              workout_step_id: newStepId,
              exercise_id: set.exerciseId,
              is_warmup: set.isWarmup,
              date: workout.date ?? new Date().getTime(),
              is_weak_ass_record: false,
              reps: set.reps,
              weight_mcg: set.weightMcg,
              distance_mm: set.distanceMm,
              duration_ms: set.durationMs,
              speed_kph: set.speedKph,
              rest_ms: set.restMs,
              completed_at: null,
            })
            .execute()
        }
      }
    }

    return newWorkoutId
  }
}
