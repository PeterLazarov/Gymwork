import { DateTime } from 'luxon'
import { Exercise } from './Exercise'

// ! THIS SHOULD NOT BE READ HERE
import { exercises } from '../data/exercises.json'
import { ExerciseSet } from './ExerciseSet'

export type WorkoutSerializable = {
  /** ISO Date */
  date: string
  work: Array<{
    /** Exercise name */
    exercise: string
    sets: Array<ExerciseSet>
  }>
}

export type Workout = {
  date: DateTime
  work: Array<{
    exercise: Exercise
    sets: Array<ExerciseSet>
  }>
}

export function workoutToSerializable(w: Workout): WorkoutSerializable {
  return {
    date: w.date.toISODate()!,
    work: w.work.map(({ exercise, sets }) => ({
      exercise: exercise.name,
      sets,
    })),
  }
}
export function workoutFromSerializable(s: WorkoutSerializable): Workout {
  return {
    date: DateTime.fromISO(s.date),
    work: s.work.map(({ exercise, sets }) => ({
      exercise: exercises.find(({ name }) => name === exercise)!,
      sets,
    })),
  }
}
