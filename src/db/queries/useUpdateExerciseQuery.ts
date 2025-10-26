import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { ExerciseModel } from "../models/ExerciseModel"
import { Exercise, exercise_metrics, exercises } from "../schema"
import { useDB } from "../useDB"

export const useUpdateExerciseQuery = () => {
  const { drizzleDB } = useDB()

  async function deleteAndRecreateExerciseMetrics(
    exerciseId: number,
    metrics: ExerciseModel["metrics"],
    timestamp: number,
  ) {
    await drizzleDB.delete(exercise_metrics).where(eq(exercise_metrics.exercise_id, exerciseId))

    await drizzleDB.insert(exercise_metrics).values(
      metrics.map((metric) => ({
        exercise_id: exerciseId,
        measurement_type: metric.measurement_type,
        unit: metric.unit,
        created_at: timestamp,
        updated_at: timestamp,
      })),
    )
  }

  return async (exerciseId: number, exercise: Partial<ExerciseModel>) => {
    const timestamp = DateTime.now().toMillis()

    const updateData: Partial<Exercise> = {
      updated_at: timestamp,
    }

    if (exercise.name !== undefined) updateData.name = exercise.name
    if (exercise.images !== undefined) updateData.images = exercise.images
    if (exercise.equipment !== undefined) updateData.equipment = exercise.equipment
    if (exercise.muscleAreas !== undefined) updateData.muscle_areas = exercise.muscleAreas
    if (exercise.muscles !== undefined) updateData.muscles = exercise.muscles
    if (exercise.instructions !== undefined) updateData.instructions = exercise.instructions
    if (exercise.tips !== undefined) updateData.tips = exercise.tips
    if (exercise.position !== undefined) updateData.position = exercise.position
    if (exercise.stance !== undefined) updateData.stance = exercise.stance
    if (exercise.isFavorite !== undefined) updateData.is_favorite = exercise.isFavorite

    await drizzleDB.update(exercises).set(updateData).where(eq(exercises.id, exerciseId))

    if (exercise.metrics !== undefined) {
      await deleteAndRecreateExerciseMetrics(exerciseId, exercise.metrics, timestamp)
    }

    return drizzleDB.select().from(exercises).where(eq(exercises.id, exerciseId))
  }
}
