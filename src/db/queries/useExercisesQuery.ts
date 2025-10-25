import { useDB } from "../useDB"

export const useExercisesQuery = () => {
  const { drizzleDB } = useDB()

  return ({isFavorite, filterString}: {isFavorite?: boolean, filterString?: string}) =>
    drizzleDB.query.exercises.findMany({
      where: (exercises, { eq }) => {
        if (isFavorite === undefined) return undefined
        
        return eq(exercises.is_favorite, isFavorite)
      }
    })
}
