import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import workoutSeedData from '../../dbold/seeds/workout-seed-data.json'
import * as storage from '../../utils/storage'
import { Workout, WorkoutModel, WorkoutSnapshotIn } from '../Workout'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      setTimeout(async () => {
        const workouts = await storage.load<WorkoutSnapshotIn[]>('workouts')
        console.log('fetching')

        if (workouts && workouts?.length > 0) {
          store.setProp('workouts', workouts)
        } else {
          await this.seed()
        }
      }, 1000)
    },
    async seed() {
      console.log('seeding')

      store.setProp('workouts', workoutSeedData)
    },
    createWorkout(date: string) {
      const created = WorkoutModel.create({
        date,
      })
      store.setProp('workouts', [...store.workouts, created])
      return created
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
