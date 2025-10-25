import { DateTime } from "luxon"
import { Workout, workouts } from "../schema"
import { useDB } from "../useDB"

export const useInsertWorkoutQuery = () => {
  const { drizzleDB } = useDB()

  return (workout: Partial<Workout>) => {
    const timestamp = DateTime.now().toMillis()
      
    return drizzleDB.insert(workouts).values({
      date: workout.date,
      is_template: workout.is_template || false,
      created_at: timestamp,
      updated_at: timestamp,
      feeling: workout.feeling || null,
      notes: workout.notes || null,
      rpe: workout.rpe || null,
      pain: workout.pain || null,
      name: workout.name || null,
      ended_at: workout.ended_at || null,
      duration_ms: workout.duration_ms || null,
    })
  }
}
