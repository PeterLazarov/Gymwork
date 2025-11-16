import { useQueryClient } from '@tanstack/react-query'
import { eq } from "drizzle-orm"
import { workouts } from "../schema"
import { useDB } from "../useDB"

export const useRemoveWorkoutQuery = () => {
  const { drizzleDB } = useDB()
  const queryClient = useQueryClient()

  return async (workoutId: number) => {
    await drizzleDB
      .delete(workouts)
      .where(eq(workouts.id, workoutId))
    
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
  }
}
