import { eq } from "drizzle-orm"
import { workout_steps } from "../schema"
import { useDB } from "../useDB"

export const useRemoveWorkoutStepQuery = () => {
  const { drizzleDB } = useDB()
  return async (workoutStepId: number) => {
    await drizzleDB.delete(workout_steps).where(eq(workout_steps.id, workoutStepId))
  }
}
