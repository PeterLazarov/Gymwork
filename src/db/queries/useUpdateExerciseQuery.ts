import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { Exercise, exercises } from "../schema"
import { useDB } from "../useDB"

export const useUpdateExerciseQuery = () => {
  const { drizzleDB } = useDB()

  return async (exerciseId: number, exercise: Partial<Exercise>) => {
    const timestamp = DateTime.now().toMillis()

    return drizzleDB
      .update(exercises)
      .set({
        ...exercise,
        updated_at: timestamp,
      })
      .where(eq(exercises.id, exerciseId))
      .execute()
  }
}
