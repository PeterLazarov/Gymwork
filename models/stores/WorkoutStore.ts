import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import * as storage from '../../utils/storage'
import { WorkoutModel, WorkoutSnapshotIn } from '../Workout'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      const workouts = await storage.load<WorkoutSnapshotIn[]>('workouts')
      store.setProp('workouts', workouts)
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
