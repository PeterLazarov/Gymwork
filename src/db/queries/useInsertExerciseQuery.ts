import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { ExerciseModel } from "../models/ExerciseModel"
import { InsertExercise, exercise_metrics, exercises } from "../schema"
import { useDB } from "../useDB"

export const useInsertExerciseQuery = () => {
  const { drizzleDB } = useDB()

  return async (exercise: Omit<Partial<ExerciseModel>, "name"> & { name: string }) => {
    const timestamp = DateTime.now().toMillis()

    const insertData: InsertExercise = {
      name: exercise.name,
      created_at: timestamp,
      updated_at: timestamp,
      images: exercise.images,
      equipment: exercise.equipment,
      muscle_areas: exercise.muscleAreas,
      muscles: exercise.muscles,
      instructions: exercise.instructions,
      tips: exercise.tips,
      position: exercise.position,
      stance: exercise.stance,
      is_favorite: exercise.isFavorite ?? false,
    }

    const result = await drizzleDB.insert(exercises).values(insertData).returning()

    const exerciseId = result[0].id

    if (exercise.metrics !== undefined && exercise.metrics.length > 0) {
      await drizzleDB.insert(exercise_metrics).values(
        exercise.metrics.map((metric) => ({
          exercise_id: exerciseId,
          measurement_type: metric.measurement_type,
          unit: metric.unit,
          more_is_better: metric.more_is_better,
          step_value: metric.step_value ?? null,
          created_at: timestamp,
          updated_at: timestamp,
        })),
      )
    }

    return drizzleDB.select().from(exercises).where(eq(exercises.id, exerciseId))
  }
}
