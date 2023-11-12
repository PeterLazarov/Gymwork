import { DateTime } from 'luxon'

import { WorkoutSnapshotIn } from '../db/models'

const numberOfWorkouts = 100
const today = DateTime.fromISO(DateTime.now().toISODate()!)
const weightIncrement = 2.5

const workoutSeedData: WorkoutSnapshotIn[] = Array.from({
  length: numberOfWorkouts,
}).map((_, i): WorkoutSnapshotIn => {
  return {
    date: today
      .minus({ days: i + i * Math.ceil(Math.random() * 2) })
      .toISODate()!,
    exercises: Array.from({ length: 5 })
      .map((_, i) => ({
        exercise: String(Math.ceil(Math.random() * 20)),
        sets: Array.from({
          length: Math.ceil(Math.random() * 5),
        }).map((val, i) => ({
          reps: Math.ceil(Math.random() * 12),
          weight: Math.ceil(Math.random() * 40) * weightIncrement,
          isWarmup: i === 0,
        })),
      }))
      .concat({
        exercise: '43',
        sets: Array.from({
          length: Math.ceil(Math.random() * 5),
        }).map((val, i) => ({
          reps: Math.ceil(Math.random() * 12),
          weight: Math.ceil(Math.random() * 40) * weightIncrement,
          isWarmup: i === 0,
        })),
      })
      .reverse(),
  }
})

export default workoutSeedData
