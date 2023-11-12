import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import exerciseSeedData from '../../data/exercises-seed-data.json'
import * as storage from '../../utils/storage'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { ExerciseModel, ExerciseSnapshotIn } from '../models'

export const ExerciseStoreModel = types
  .model('ExerciseStore')
  .props({
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      setTimeout(async () => {
        const exercises = await storage.load<ExerciseSnapshotIn[]>('exercises')
        console.log('fetching')

        if (exercises && exercises?.length > 0) {
          store.setProp('exercises', exercises)
        } else {
          await this.seed()
        }
      }, 1000)
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
  }))

export interface ExerciseStore extends Instance<typeof ExerciseStoreModel> {}
export interface ExerciseStoreSnapshot
  extends SnapshotOut<typeof ExerciseStoreModel> {}