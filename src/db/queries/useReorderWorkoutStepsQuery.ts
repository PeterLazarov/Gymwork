import { asc, eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { workout_steps } from "../schema"
import { useDB } from "../useDB"

export const useReorderWorkoutStepsQuery = () => {
  const { drizzleDB } = useDB()

  return async (workoutId: number, from: number, to: number) => {
    // If from and to are the same, no reordering needed
    if (from === to) {
      return
    }

    // Fetch all workout steps for this workout, ordered by position
    const allSteps = await drizzleDB
      .select()
      .from(workout_steps)
      .where(eq(workout_steps.workout_id, workoutId))
      .orderBy(asc(workout_steps.position))

    // Create a new array with the reordered steps
    const reorderedSteps = [...allSteps]
    const [movedStep] = reorderedSteps.splice(from, 1)
    reorderedSteps.splice(to, 0, movedStep)

    // Update the position field for each step to reflect the new order
    const timestamp = DateTime.now().toMillis()

    // Update all steps with new positions
    await Promise.all(
      reorderedSteps.map((step, index) => {
        return drizzleDB
          .update(workout_steps)
          .set({
            position: index,
            updated_at: timestamp,
          })
          .where(eq(workout_steps.id, step.id))
      }),
    )
  }
}
