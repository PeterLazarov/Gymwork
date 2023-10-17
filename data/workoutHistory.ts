import { WorkoutSerializable } from '../types/Workout'
import { exercises } from './exercises.json'

export const workoutHistory: Record<string, WorkoutSerializable[]> = {
  ['2023-10-02']: [
    {
      date: '2023-10-02',
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
      date: '2023-10-02',
      work: [
        {
          exercise: exercises[2].name,
          sets: [
            { reps: 3, weight: 50, weightUnit: 'kg' },
            { reps: 3, weight: 50, weightUnit: 'kg' },
            { reps: 3, weight: 50, weightUnit: 'kg' },
          ],
        },
        {
          exercise: exercises[3].name,
          sets: [
            { reps: 5, weight: 5, weightUnit: 'kg' },
            { reps: 5, weight: 5, weightUnit: 'kg' },
            { reps: 5, weight: 5, weightUnit: 'kg' },
          ],
        },
      ],
    },
  ],

  ['2023-10-04']: [
    {
      date: '2023-10-04',
      work: [
        {
          exercise: exercises[3].name,
          sets: [
            { reps: 5, weight: 50, weightUnit: 'kg' },
            { reps: 5, weight: 50, weightUnit: 'kg' },
            { reps: 5, weight: 50, weightUnit: 'kg' },
          ],
        },
        {
          exercise: exercises[4].name,
          sets: [
            { reps: 5, weight: 5, weightUnit: 'kg' },
            { reps: 5, weight: 5, weightUnit: 'kg' },
            { reps: 5, weight: 5, weightUnit: 'kg' },
          ],
        },
      ],
    },
  ],

  ['2023-10-14']: [
    {
      date: '2023-10-14',
      work: [
        {
          exercise: exercises[5].name,
          sets: [
            { reps: 5, weight: 50, weightUnit: 'kg' },
            { reps: 5, weight: 50, weightUnit: 'kg' },
            { reps: 5, weight: 50, weightUnit: 'kg' },
          ],
        },
        {
          exercise: exercises[6].name,
          sets: [
            { reps: 5, weight: 5, weightUnit: 'kg' },
            { reps: 5, weight: 5, weightUnit: 'kg' },
            { reps: 5, weight: 5, weightUnit: 'kg' },
          ],
        },
      ],
    },
  ],
}
