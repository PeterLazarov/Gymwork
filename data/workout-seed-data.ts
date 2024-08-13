import { DateTime } from 'luxon'

import exerciseSeedData from './exercises-seed-data.json'
import { WorkoutSetSnapshotIn, WorkoutSnapshotIn } from '../db/models'
const numberOfWorkouts = 100
const today = DateTime.fromISO(DateTime.now().toISODate()!)
const weightIncrement = 2.5

function between(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

// const cardioExerciseID = exerciseSeedData
//   .findIndex(e => e.muscles.includes('cardio'))
//   .toString()
const cardioExerciseID = '2'

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
        const exercise = String(between(1, 10))
        return Array.from({ length: between(2, 5) }).map((_, i) => ({
          exercise,
          isWarmup: i === 0,
          reps: between(3, 12),
          weight: between(8, 40) * weightIncrement,
        }))
      })
      .concat(
        // Bench Press
        Array.from({ length: between(3, 5) }).map((_, i) => {
          return {
            exercise: '44',
            reps: between(3, 12),
            weight: between(8, 40) * weightIncrement,
            isWarmup: i === 0,
          }
        }),
        // // Cardio
        // Array.from({ length: between(1, 2) }).map((_, i) => {
        //   const km = between(2, 12)
        //   const weight = between(0, 10) // not supported yet?

        //   return {
        //     exercise: cardioExerciseID,
        //     distanceUnit: 'm',
        //     distance: km * 1000,
        //     durationSecs: km * between(4, 7) * 60,
        //     reps: 1, // assumed 1?
        //     weight,
        //   }
        // })
      )
      .reverse(),
  }
})

export default workoutSeedData
