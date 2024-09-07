import { DateTime } from 'luxon'

import exerciseSeedData from './exercises-seed-data.json'
import {
  WorkoutSetSnapshotIn,
  WorkoutSnapshotIn,
  WorkoutStepSnapshotIn,
} from '../models'
import convert from 'convert-units'
const numberOfWorkouts = 20
const today = DateTime.fromISO(DateTime.now().toISODate()!)
const weightIncrementKg = 2.5
const setDuration = 100 * 1000
const rest = 300 * 1000

function between(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

const cardioExerciseID = exerciseSeedData
  .findIndex(e => e.muscles.includes('cardio'))
  .toString()

function generateStep(exercises: string[], sets: WorkoutSetSnapshotIn[]): WorkoutStepSnapshotIn {
  return {
    exercises,
    sets,
    type: exercises.length > 1 ? 'superSet' : 'straightSet' 
  }
}

function generateWorkout (date: string) {
  let workoutTime = DateTime.fromISO(date).set({
    hour: 8,
    minute: 0,
    second: 0,
  })

  const generateRandomExercises = (date: string) => {
    return Array.from({
      length: between(3, 8),
    }).map((_, i): WorkoutStepSnapshotIn => {
      const exercise = String(between(0, 100))
      const restMs = i > 0 ? rest : 0
      workoutTime = workoutTime.plus({ milliseconds: restMs * i + setDuration * i })
      
      console.log(workoutTime.toFormat('hh:mm'))
      const sets: WorkoutSetSnapshotIn[] = Array.from({ length: between(2, 5) }).map((_, i) => ({
        exercise,
        isWarmup: i === 0,
        reps: between(3, 12),
        weightMcg: convert(between(8, 40) * weightIncrementKg)
          .from('kg')
          .to('mcg'),
        date,
        createdAt: workoutTime.toMillis(),
      }))

      return generateStep([exercise], sets)
    })
  }

  function generateBenchStep(date: string) {
    const benchSets: WorkoutSetSnapshotIn[] = Array.from({
      length: between(3, 5),
    }).map((_, i) => {
      const weightMcg = convert(between(8, 40) * weightIncrementKg)
        .from('kg')
        .to('mcg')
  
      const restMs = i > 0 ? rest : 0
      workoutTime = workoutTime.plus({ milliseconds: restMs * i + setDuration * i })
      console.log(workoutTime.toFormat('hh:mm'))
  
      return {
        exercise: '44',
        reps: between(3, 12),
        weightMcg,
        isWarmup: i === 0,
        date,
        restMs,
        createdAt: workoutTime.toMillis(),
      }
    })

    return generateStep(['44'], benchSets)
  }
  
  function generateCardioStep(date: string) {
    const cardioSets: WorkoutSetSnapshotIn[] = Array.from({ 
      length: between(1, 2) 
    }).map((_, i) => {
      const km = between(1, 3)
      // const weight = between(0, 10) // not supported yet?
      const duration = km * between(4, 7)
      workoutTime = workoutTime.plus({ minutes: km * duration })
      console.log(workoutTime.toFormat('hh:mm'))

      return {
        exercise: cardioExerciseID,
        distanceMm: convert(km).from('km').to('mm'),
        durationMs: convert(duration)
          .from('min')
          .to('ms'),
        createdAt: workoutTime.toMillis(),
        date,
      }
    })

    return generateStep([cardioExerciseID], cardioSets)
  }

  function generateSupersetStep(date: string) {
    const sets: WorkoutSetSnapshotIn[] = Array.from({ 
      length: between(2, 3) * 2 
    }).map((_, i) => {
      const weightMcg = convert(between(8, 40) * weightIncrementKg)
      .from('kg')
      .to('mcg')

      const restMs = i > 0 ? rest : 0
      workoutTime = workoutTime.plus({ milliseconds: restMs * i + setDuration * i })
      console.log(workoutTime.toFormat('hh:mm'))

      return {
        exercise: i % 2 === 0 ? '44' : '42',
        reps: between(3, 12),
        weightMcg,
        isWarmup: i === 0 || i === 1,
        date,
        restMs,
        createdAt: workoutTime.toMillis(),
      }
    })

    return generateStep(['44', '42'], sets)
  }

  const generateSteps = (date: string): WorkoutStepSnapshotIn[] => {
    const benchStep = generateBenchStep(date)

    const cardioStep = generateCardioStep(date)

    const supersetStep = generateSupersetStep(date)

    return generateRandomExercises(date).concat(benchStep, cardioStep, supersetStep).reverse()
  }

  return {
    date,
    steps: generateSteps(date),
  }
}
const workoutSeedData: WorkoutSnapshotIn[] = Array.from({
  length: numberOfWorkouts,
}).map((_, i): WorkoutSnapshotIn => {
  const date = today
    .minus({ days: i + i * Math.ceil(Math.random() * 2) })
    .toISODate()!

  return generateWorkout(date)
})

export default workoutSeedData

