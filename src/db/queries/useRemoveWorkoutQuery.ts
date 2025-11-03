import { and, eq } from "drizzle-orm"
import { workouts } from "../schema"
import { useDB } from "../useDB"

export const useRemoveWorkoutQuery = () => {
  const { drizzleDB } = useDB()
  return async (workoutId: number) => 
    await drizzleDB
      .delete(workouts)
      .where(eq(workouts.id, workoutId))
}
