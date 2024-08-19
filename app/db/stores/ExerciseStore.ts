import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import exerciseSeedData from '../seeds/exercises-seed-data.json'
import { uniqueValues } from '../../../app/utils/array'
import * as storage from '../../../app/utils/storage'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
  Exercise,
  ExerciseModel,
  ExerciseSnapshotIn,
  measurementDefaults,
} from '../models'

export const ExerciseStoreModel = types
  .model('ExerciseStore')
  .props({
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      const exercises = await storage.load<ExerciseSnapshotIn[]>('exercises')

      if (exercises && exercises?.length > 0) {
        store.setProp('exercises', exercises)
      } else {
        await this.seed()
      }
    },
    async seed() {
      console.log('seeding excercises')

      const exercisesData: ExerciseSnapshotIn[] = exerciseSeedData.map(
        ({ measurementType, ...exercise }, i): ExerciseSnapshotIn => {
          return {
            ...exercise,
            guid: String(i),
            measurements: {
              weight: measurementDefaults.weight,
              reps: measurementDefaults.reps,
            },
          }
        }
      )
      store.setProp('exercises', exercisesData)
    },
    editExercise(updated: Exercise) {
      const mappedArray = store.exercises.map(e =>
        e.guid === updated.guid ? updated : e
      )
      store.setProp('exercises', mappedArray)
    },
    createExercise(created: Exercise) {
      store.exercises.push(created)
    },
  }))
  .views(store => ({
    get muscleOptions() {
      return uniqueValues(store.exercises.flatMap(e => e.muscles))
    },
    get favoriteExercises() {
      return store.exercises.filter(e => e.isFavorite)
    },
  }))

export interface ExerciseStore extends Instance<typeof ExerciseStoreModel> {}
export interface ExerciseStoreSnapshot
  extends SnapshotOut<typeof ExerciseStoreModel> {}
