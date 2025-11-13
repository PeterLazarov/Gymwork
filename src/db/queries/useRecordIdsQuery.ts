import { eq, sql } from "drizzle-orm"
import { useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { sets } from "../schema"
import { useDB } from "../useDB"
import { useTanstackQuery } from "@/tanstack-query"

export const useRecordIdsQuery = (workoutStepId: number) => {
  const { drizzleDB } = useDB()

  const query = useMemo(() => {
    return drizzleDB
      .select({
        id: sql<number>`er.record_id`.as("id"),
      })
      .from(sql`exercise_records er`)
      .innerJoin(sets, eq(sets.id, sql`er.record_id`))
      .where(eq(sets.workout_step_id, workoutStepId))
  }, [drizzleDB, workoutStepId])

  const { data, isLoading } = useTanstackQuery(query, ["sets"])

  return {
    recordIds: data ?? [],
    isLoading,
  }
}
