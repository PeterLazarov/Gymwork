import { DateTime } from 'luxon'
import { Workout, WorkoutSerializable } from '../types/Workout'
import { exercises } from './exercises.json'

export const workoutHistory: Array<WorkoutSerializable> = [
  {
    date: DateTime.fromObject({
      year: 2023,
      month: 10,
      day: 3,
    }).toISODate()!,
    work: [
      {
        exercise: exercises[0].name,
        sets: [
          { reps: 5, weight: 50, weightUnit: 'kg' },
          { reps: 5, weight: 50, weightUnit: 'kg' },
          { reps: 5, weight: 50, weightUnit: 'kg' },
        ],
      },
      {
        exercise: exercises[1].name,
        sets: [
          { reps: 5, weight: 5, weightUnit: 'kg' },
          { reps: 5, weight: 5, weightUnit: 'kg' },
          { reps: 5, weight: 5, weightUnit: 'kg' },
        ],
      },
    ],
  },

  {
    date: DateTime.fromObject({
      year: 2023,
      month: 10,
      day: 5,
    }).toISODate()!,
    work: [
      {
        exercise: exercises[2].name,
        sets: [
          { reps: 5, weight: 50, weightUnit: 'kg' },
          { reps: 5, weight: 50, weightUnit: 'kg' },
          { reps: 5, weight: 50, weightUnit: 'kg' },
        ],
      },
      {
        exercise: exercises[3].name,
        sets: [
          { reps: 8, weight: 5, weightUnit: 'kg' },
          { reps: 8, weight: 5, weightUnit: 'kg' },
          { reps: 8, weight: 5, weightUnit: 'kg' },
        ],
      },
    ],
  },

  {
    date: DateTime.fromObject({
      year: 2023,
      month: 10,
      day: 12,
    }).toISODate()!,
    work: [
      {
        exercise: exercises[4].name,
        sets: [
          { reps: 10, weight: 50, weightUnit: 'kg' },
          { reps: 10, weight: 50, weightUnit: 'kg' },
          { reps: 10, weight: 50, weightUnit: 'kg' },
        ],
      },
      {
        exercise: exercises[5].name,
        sets: [
          { reps: 8, weight: 5, weightUnit: 'kg' },
          { reps: 8, weight: 5, weightUnit: 'kg' },
          { reps: 8, weight: 5, weightUnit: 'kg' },
        ],
      },
    ],
  },
]
