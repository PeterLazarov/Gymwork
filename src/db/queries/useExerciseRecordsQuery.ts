import { eq, sql } from "drizzle-orm"
import { useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"

export const useExerciseRecordsQuery = (exerciseId: number) => {
  const { drizzleDB } = useDB()

  const query = useMemo(() => {
    const recordIdsSubquery = drizzleDB
      .select({ id: sql<number>`record_id`.as("id") })
      .from(sql`exercise_records`)
      .where(eq(sql`exercise_id`, exerciseId))

    return drizzleDB.query.sets.findMany({
      where: (sets, { inArray }) => inArray(sets.id, recordIdsSubquery),
      with: {
        exercise: {
          with: {
            exerciseMetrics: true,
          },
        },
      },
    })
  }, [drizzleDB, exerciseId])

  const records = useExpoQuery(query, ["sets"])

  return records
}
