import { and, eq } from "drizzle-orm"
import { workouts } from "../schema"
import { useDB } from "../useDB"

export const useRemoveWorkoutQuery = () => {
  const { drizzleDB } = useDB()
  return (workoutId: number) => 
    drizzleDB
      .delete(workouts)
      .where(eq(workouts.id, workoutId))
}
