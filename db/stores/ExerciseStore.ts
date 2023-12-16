import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import exerciseSeedData from '../../data/exercises-seed-data.json'
import { uniqueValues } from '../../utils/array'
import * as storage from '../../utils/storage'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Exercise, ExerciseModel, ExerciseSnapshotIn } from '../models'

export const ExerciseStoreModel = types
  .model('ExerciseStore')
  .props({
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      const exercises = await storage.load<ExerciseSnapshotIn[]>('exercises')
      console.log('fetching')

      if (exercises && exercises?.length > 0) {
        store.setProp('exercises', exercises)
      } else {
        await this.seed()
      }
    },
    async seed() {
      console.log('seeding')

      store.setProp(
        'exercises',
        exerciseSeedData.map(
          (exercise, i): ExerciseSnapshotIn => ({
            ...exercise,
            guid: String(i),
          })
        )
      )
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
  }))

export interface ExerciseStore extends Instance<typeof ExerciseStoreModel> {}
export interface ExerciseStoreSnapshot
  extends SnapshotOut<typeof ExerciseStoreModel> {}
