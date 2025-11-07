import { DateTime } from "luxon"
import { SetModel } from "../models/SetModel"
import { InsertSet, sets } from "../schema"
import { useDB } from "../useDB"

export const useInsertSetQuery = () => {
  const { drizzleDB } = useDB()

  return async (set: Partial<SetModel>, completionEnabled: boolean = false) => {
    const timestamp = DateTime.now().toMillis()

    const insertData: InsertSet = {
      exercise_id: set.exercise!.id!,
      created_at: timestamp,
      updated_at: timestamp,
      workout_step_id: set.workoutStepId!,
      is_warmup: set.isWarmup ?? false,
      date: set.date!,
      is_weak_ass_record: set.isWeakAssRecord ?? false,
      reps: set.reps,
      weight_mcg: set.weightMcg,
      distance_mm: set.distanceMm,
      duration_ms: set.durationMs,
      speed_kph: set.speedKph,
      rest_ms: set.restMs,
      completed_at: completionEnabled ? null : timestamp
    }
    return drizzleDB.insert(sets).values(insertData).returning()
  }
}
