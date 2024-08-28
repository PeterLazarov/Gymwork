import { DateTime } from 'luxon'

import exerciseSeedData from './exercises-seed-data.json'
import { WorkoutSetSnapshotIn, WorkoutSnapshotIn } from '../models'
import convert from 'convert-units'
const numberOfWorkouts = 100
const today = DateTime.fromISO(DateTime.now().toISODate()!)
const weightIncrementKg = 2.5

function between(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

const cardioExerciseID = exerciseSeedData
  .findIndex(e => e.muscles.includes('cardio'))
  .toString()

const generateRandomExercises = (date: string) => {
  return Array.from({
    length: between(3, 8),
  }).flatMap((_, i): WorkoutSetSnapshotIn[] => {
    const exercise = String(between(0, 100))
    return Array.from({ length: between(2, 5) }).map((_, i) => ({
      exercise,
      isWarmup: i === 0,
      reps: between(3, 12),
      weightMcg: convert(between(8, 40) * weightIncrementKg)
        .from('kg')
        .to('mcg'),
      date,
    }))
  })
}

const generateSets = (date: string): WorkoutSetSnapshotIn[] => {
  const workoutStart = DateTime.fromISO(date).set({
    hour: 8,
    minute: 0,
    second: 0,
  })

  const benchSets: WorkoutSetSnapshotIn[] = Array.from({
    length: between(3, 5),
  }).map((_, i) => {
    const weightMcg = convert(between(8, 40) * weightIncrementKg)
      .from('kg')
      .to('mcg')

    const restMs = i > 0 ? 300000 : 0
    const setDuration = 20000
    return {
      exercise: '44', // Лежанка
      reps: between(3, 12),
      weightMcg,
      isWarmup: i === 0,
      date,
      restMs,
      createdAt: workoutStart
        .plus({ milliseconds: restMs * i + setDuration * i })
        .toJSDate(),
    }
  })

  const cardioSets = Array.from({ length: between(1, 2) }).map((_, i) => {
    const km = between(1, 3)
    // const weight = between(0, 10) // not supported yet?

    return {
      exercise: cardioExerciseID,
      distanceMm: convert(km).from('km').to('mm'),
      durationMs: convert(km * between(4, 7))
        .from('min')
        .to('ms'),
      createdAt: workoutStart.plus({ minutes: i * 10 }).toJSDate(),
      date,
    } as WorkoutSetSnapshotIn
  })

  return generateRandomExercises(date).concat(benchSets, cardioSets).reverse()
}
const workoutSeedData: WorkoutSnapshotIn[] = Array.from({
  length: numberOfWorkouts,
}).map((_, i): WorkoutSnapshotIn => {
  const date = today
    .minus({ days: i + i * Math.ceil(Math.random() * 2) })
    .toISODate()!

  return {
    date,
    sets: generateSets(date),
  }
})

export default workoutSeedData
