import { WorkoutSnapshotIn } from '../db/models'
import { DateTime } from 'luxon'

const numberOfWorkouts = 100
const today = DateTime.fromISO(DateTime.now().toISODate()!)

const workoutSeedData: WorkoutSnapshotIn[] = Array.from({
  length: numberOfWorkouts,
}).map((_, i): WorkoutSnapshotIn => {
  return {
    date: today
      // .minus({ days: i * Math.ceil(Math.random() * 3) })
      .minus({ days: i + 1 })
      .toISODate()!,
    exercises: [
      // Only bench
      {
        exercise: '43',
        sets: Array.from({
          length: Math.ceil(Math.random() * 5),
        }).map(() => ({
          reps: Math.ceil(Math.random() * 12),
          weight: Math.ceil(Math.random() * 100),
        })),
      },
    ],
  }
})

export default workoutSeedData
