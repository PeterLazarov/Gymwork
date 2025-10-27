import { desc, eq } from "drizzle-orm"

import { sets } from "../schema"
import { useDB } from "../useDB"

export const useExerciseLastSetQuery = () => {
  const { drizzleDB } = useDB()
  return async (exerciseId: number) => {
    const lastSet = await drizzleDB
      .select()
      .from(sets)
      .where(eq(sets.exercise_id, exerciseId))
      .orderBy(desc(sets.date))
      .limit(1)
    return lastSet[0]
  }
}
