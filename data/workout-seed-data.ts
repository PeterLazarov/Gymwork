import { DateTime } from 'luxon'

import { WorkoutSetSnapshotIn, WorkoutSnapshotIn } from '../db/models'

const numberOfWorkouts = 100
const today = DateTime.fromISO(DateTime.now().toISODate()!)
export const weightIncrement = 2.5

function between(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

const workoutSeedData: WorkoutSnapshotIn[] = Array.from({
  length: numberOfWorkouts,
}).map((_, i): WorkoutSnapshotIn => {
  return {
    date: today
      .minus({ days: i + i * Math.ceil(Math.random() * 2) })
      .toISODate()!,
    sets: Array.from({
      length: between(3, 8),
    })
      .flatMap((_, i): WorkoutSetSnapshotIn[] => {
        const exercise = String(between(0, 100))
        return Array.from({ length: between(2, 5) }).map((_, i) => ({
          exercise,
          isWarmup: i === 0,
          reps: between(3, 12),
          weight: between(8, 40) * weightIncrement,
        }))
      })
      .concat(
        Array.from({ length: between(3, 5) }).map((_, i) => {
          return {
            exercise: '43',
            reps: between(3, 12),
            weight: between(8, 40) * weightIncrement,
            isWarmup: i === 0,
          }
        })
      )
      .reverse(),
  }
})

export default workoutSeedData
