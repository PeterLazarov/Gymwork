import { eq, sql } from "drizzle-orm"
import { useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { sets } from "../schema"
import { useDB } from "../useDB"

/**
 * Hook to get record set IDs for a specific workout step
 * Returns an array of objects with { id: number } where id is the set ID that is a record
 */
export const useRecordsQuery = (workoutStepId: number) => {
  const { drizzleDB } = useDB()

  // Build a Drizzle query to find record set IDs for this workout step
  const query = useMemo(() => {
    return drizzleDB
      .select({
        id: sql<number>`er.record_id`.as("id"),
      })
      .from(sql`exercise_records er`)
      .innerJoin(sets, eq(sets.id, sql`er.record_id`))
      .where(eq(sets.workout_step_id, workoutStepId))
  }, [drizzleDB, workoutStepId])

  // Use the reactive query hook with the sets table for updates
  const records = useExpoQuery(query, ["sets"])

  return records 
}
