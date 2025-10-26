import { useDB } from "../useDB"

export const useExerciseQuery = () => {
  const { drizzleDB } = useDB()
  return (exerciseId: number) =>
    drizzleDB.query.exercises.findFirst({
      where: (exercises, { eq }) =>
        eq(exercises.id, exerciseId),
    })
}
