import { count, eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { workout_step_exercises, workout_steps } from "../schema"
import { useDB } from "../useDB"

export const useInsertExerciseInWorkoutQuery = () => {
  const { drizzleDB } = useDB()

  return async (exerciseId: number, workoutId: number) => {
    const timestamp = DateTime.now().toMillis()

    const result = await drizzleDB
      .select({ count: count() })
      .from(workout_steps)
      .where(eq(workout_steps.workout_id, workoutId))

    const nextPosition = result[0].count + 1

    const stepResult = await drizzleDB
      .insert(workout_steps)
      .values({
        workout_id: workoutId,
        step_type: "plain",
        position: nextPosition,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .execute()

    const newStepId = stepResult.lastInsertRowId as number

    await drizzleDB
      .insert(workout_step_exercises)
      .values({
        workout_step_id: newStepId,
        exercise_id: exerciseId,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .execute()

    return newStepId
  }
}
