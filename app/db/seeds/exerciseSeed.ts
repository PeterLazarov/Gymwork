import {
  ExerciseMeasurementSnapshotIn,
  ExerciseSnapshotIn,
  measurementDefaults,
} from '../models'

import _data from './exercisesAnimatic.json'

export type NormalizedEntry = {
  name: string
  images: string[]

  equipment?: string | undefined
  grip?: string | undefined
  position?: string | undefined
  stance?: string | undefined

  instructions: string[]
  tips?: string[] // catalog

  muscleAreas: string[]

  category: string // excel
  muscles: string[] // excel
}

const data = _data as Record<string, NormalizedEntry>

function getExercises() {
  return Object.fromEntries(
    Object.values(data).map(
      ({
        name,
        muscles,
        category,
        images,
        instructions,
        muscleAreas,
        equipment,
        position,
        stance,
        grip,
        tips,
      }) => {
        const measurements: ExerciseMeasurementSnapshotIn = {
          weight:
            category === 'Resistance' ? measurementDefaults.weight : undefined,
          reps: measurementDefaults.reps,

          duration: muscleAreas.includes('Cardio')
            ? measurementDefaults.duration
            : undefined,
          speed: muscleAreas.includes('Cardio')
            ? measurementDefaults.speed
            : undefined,
          distance: muscleAreas.includes('Cardio')
            ? measurementDefaults.distance
            : undefined,
        }

        const guid = `e_animatic?_${name}`
        return [
          guid,
          {
            guid,
            name,
            equipment: [equipment].filter(Boolean),
            images,
            instructions,
            muscles,
            muscleAreas,
            position,
            stance,
            measurements,
            tips,
          } as ExerciseSnapshotIn,
        ]
      }
    )
  )
}

export const exercises = getExercises()
