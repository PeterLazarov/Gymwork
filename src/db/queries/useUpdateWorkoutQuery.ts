import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { Workout, workouts } from "../schema"
import { useDB } from "../useDB"

export const useUpdateWorkoutQuery = () => {
  const { drizzleDB } = useDB()

  return async (workoutId: number, workout: Partial<Workout>) => {
    const timestamp = DateTime.now().toMillis()

    return drizzleDB
      .update(workouts)
      .set({
        ...workout,
        updated_at: timestamp,
      })
      .where(eq(workouts.id, workoutId))
      .execute()
  }
}
