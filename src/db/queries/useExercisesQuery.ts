import { and, count, desc, eq, like } from "drizzle-orm"
import { exercises, workout_step_exercises } from "../schema"
import { useDB } from "../useDB"

export const useExercisesQuery = () => {
  const { drizzleDB } = useDB()

  return ({ isFavorite, filterString }: { isFavorite?: boolean; filterString?: string }) =>
    drizzleDB.query.exercises.findMany({
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
}

export const useMostUsedExercisesQuery = () => {
  const { drizzleDB } = useDB()

  return async ({ limit, filterString }: { limit: number; filterString?: string }) => {
    const results = await drizzleDB
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
      .execute()

    return results.map((r) => r.exercise)
  }
}
