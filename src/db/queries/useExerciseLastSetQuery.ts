import { useDB } from "../useDB"

export const useExerciseLastSetQuery = () => {
  const { drizzleDB } = useDB()

  return async (exerciseId: number) => {
    const lastSet = await drizzleDB.query.sets.findFirst({
      where: (sets, { eq }) => eq(sets.exercise_id, exerciseId),
      orderBy: (sets, { desc }) => [desc(sets.date)],
      with: {
        exercise: {
          with: {
            exerciseMetrics: true,
          },
        },
      },
    })
    return lastSet
  }
}
