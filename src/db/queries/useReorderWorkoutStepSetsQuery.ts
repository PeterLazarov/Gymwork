import { asc, eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { workout_steps } from "../schema"
import { useDB } from "../useDB"

export const useReorderWorkoutStepsQuery = () => {
  const { drizzleDB } = useDB()

  return async (workoutId: number, from: number, to: number) => {
    if (from === to) {
      return
    }

    const allSteps = await drizzleDB
      .select()
      .from(workout_steps)
      .where(eq(workout_steps.workout_id, workoutId))
      .orderBy(asc(workout_steps.position))

    const reorderedSteps = [...allSteps]
    const [movedStep] = reorderedSteps.splice(from, 1)
    reorderedSteps.splice(to, 0, movedStep)

    const timestamp = DateTime.now().toMillis()

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
