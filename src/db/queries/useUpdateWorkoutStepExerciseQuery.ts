import { and, eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { ExerciseModel } from "../models/ExerciseModel"
import { sets, workout_step_exercises } from "../schema"
import { useDB } from "../useDB"

export const useUpdateWorkoutStepExerciseQuery = () => {
  const { drizzleDB } = useDB()

  return async (workoutStepId: number, oldExerciseId: number, newExercise: ExerciseModel) => {
    const timestamp = DateTime.now().toMillis()

    await drizzleDB
      .delete(sets)
      .where(and(eq(sets.exercise_id, oldExerciseId), eq(sets.workout_step_id, workoutStepId)))

    await drizzleDB
      .delete(workout_step_exercises)
      .where(
        and(
          eq(workout_step_exercises.exercise_id, oldExerciseId),
          eq(workout_step_exercises.workout_step_id, workoutStepId),
        ),
      )

    return drizzleDB.insert(workout_step_exercises).values({
      workout_step_id: workoutStepId,
      exercise_id: newExercise.id!,
      created_at: timestamp,
      updated_at: timestamp,
    })
  }
}
