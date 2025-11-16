import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from "luxon"
import { WorkoutModel } from "../models/WorkoutModel"
import { workout_step_exercises, workout_steps, workouts } from "../schema"
import { useDB } from "../useDB"

export const useInsertWorkoutQuery = () => {
  const { drizzleDB } = useDB()
  const queryClient = useQueryClient()

  async function createWorkoutSteps(
    workoutId: number,
    steps: WorkoutModel["workoutSteps"],
    timestamp: number,
  ) {
    for (const step of steps) {
      const stepResult = await drizzleDB
        .insert(workout_steps)
        .values({
          workout_id: workoutId,
          step_type: step.stepType,
          position: step.position,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .returning()

      const stepId = stepResult[0].id

      if (step.exercises && step.exercises.length > 0) {
        await drizzleDB.insert(workout_step_exercises).values(
          step.exercises
            .filter((exercise) => exercise.id !== undefined)
            .map((exercise) => ({
              workout_step_id: stepId,
              exercise_id: exercise.id!,
              created_at: timestamp,
              updated_at: timestamp,
            })),
        )
      }
    }
  }

  return async (workout: Partial<WorkoutModel>) => {
    const timestamp = DateTime.now().toMillis()

    const result = await drizzleDB
      .insert(workouts)
      .values({
        date: workout.date,
        is_template: workout.isTemplate || false,
        created_at: timestamp,
        updated_at: timestamp,
        feeling: workout.feeling || null,
        notes: workout.notes || null,
        rpe: workout.rpe || null,
        pain: workout.pain || null,
        name: workout.name || null,
        ended_at: workout.endedAt || null,
        duration_ms: workout.durationMs || null,
      })
      .returning()

    const workoutId = result[0].id

    if (workout.workoutSteps && workout.workoutSteps.length > 0) {
      await createWorkoutSteps(workoutId, workout.workoutSteps, timestamp)
    }

    await queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey as string[]

        return queryKey.some(
          key => 
            typeof key === 'string' &&
            (key.includes('workouts') ||
              key.includes('workout_steps') ||
              key.includes('workout_step_exercises') ||
              key.includes('sets'))
        )
      }
    })

    return result
  }
}
