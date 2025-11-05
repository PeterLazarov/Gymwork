import { and, count, desc, eq, like } from "drizzle-orm"
import { useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { exercises, workout_step_exercises } from "../schema"
import { useDB } from "../useDB"

type UseExercisesQueryParams = {
  isFavorite?: boolean
  filterString?: string
}

export const useExercisesQuery = ({ isFavorite, filterString }: UseExercisesQueryParams = {}) => {
  const { drizzleDB } = useDB()

  const query = useMemo(() => {
    return drizzleDB.query.exercises.findMany({
      where: (exercises, { eq }) => {
        const conditions = []

        if (isFavorite !== undefined) {
          conditions.push(eq(exercises.is_favorite, isFavorite))
        }

        if (filterString) {
          conditions.push(like(exercises.name, `%${filterString}%`))
        }

        if (conditions.length === 0) return undefined
        if (conditions.length === 1) return conditions[0]
        return and(...conditions)
      },
    })
  }, [drizzleDB, isFavorite, filterString])

  const { data, isLoading } = useExpoQuery(query, ["exercises"])

  return {
    exercises: data ?? [],
    isLoading,
  }
}
export const useMostUsedExercisesQuery = ({
  limit,
  filterString,
}: {
  limit: number
  filterString?: string
}) => {
  const { drizzleDB } = useDB()

  const query = useMemo(() => {
    return drizzleDB
      .select({
        exercise: exercises,
        usage_count: count(workout_step_exercises.id),
      })
      .from(exercises)
      .leftJoin(workout_step_exercises, eq(workout_step_exercises.exercise_id, exercises.id))
      .groupBy(exercises.id)
      .orderBy(desc(count(workout_step_exercises.id)))
      .where(filterString ? like(exercises.name, `%${filterString}%`) : undefined)
      .limit(limit)
  }, [drizzleDB, limit, filterString])

  const { data, isLoading } = useExpoQuery(query, ["exercises", "workout_step_exercises"])

  const exercisesResult = useMemo(() => {
    return data.map((record) => record.exercise)
  }, [data])

  return {
    exercises: exercisesResult,
    isLoading,
  }
}
