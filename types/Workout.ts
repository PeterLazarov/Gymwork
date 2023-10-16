import { DateTime } from 'luxon'

export type Workout = {
  date: DateTime
  work: Array<{
    exercise: string
    sets: Array<{ reps: number; weight: number; weightUnit: string }>
  }>
}
