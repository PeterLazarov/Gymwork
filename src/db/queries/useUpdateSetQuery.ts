import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { SetModel } from "../models/SetModel"
import { Set, sets } from "../schema"
import { useDB } from "../useDB"

export const useUpdateSetQuery = () => {
  const { drizzleDB } = useDB()

  return async (set: Partial<SetModel>) => {
    const timestamp = DateTime.now().toMillis()

    const updateData: Partial<Set> = {
      updated_at: timestamp,
    }

    if (set.reps !== undefined) updateData.reps = set.reps
    if (set.weightMcg !== undefined) updateData.weight_mcg = set.weightMcg
    if (set.distanceMm !== undefined) updateData.distance_mm = set.distanceMm
    if (set.durationMs !== undefined) updateData.duration_ms = set.durationMs
    if (set.speedKph !== undefined) updateData.speed_kph = set.speedKph
    if (set.restMs !== undefined) updateData.rest_ms = set.restMs
    if (set.completedAt !== undefined) updateData.completed_at = set.completedAt

    await drizzleDB.update(sets).set(updateData).where(eq(sets.id, set.id!))

    return drizzleDB.select().from(sets).where(eq(sets.id, set.id!))
  }
}
