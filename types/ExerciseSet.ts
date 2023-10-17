import { DateTime } from 'luxon'

export type ExerciseSet = {
  weight: number
  reps: number
  weightUnit: string
  completedAt?: DateTime
}
