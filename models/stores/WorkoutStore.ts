import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import workoutSeedData from '../../dbold/seeds/workout-seed-data.json'
import * as storage from '../../utils/storage'
import { WorkoutModel, WorkoutSnapshotIn } from '../Workout'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Exercise } from '../Exercise'
import { WorkoutExerciseModel } from '../WorkoutExercise'

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
      store.workouts.push(created)
      return created
    },
    addWorkoutExercise(date: string, exercise: Exercise) {
      const index = store.workouts.findIndex(w => w.date === date)
      const created = WorkoutExerciseModel.create({
        exercise: exercise.guid,
      })
      store.workouts[index].exercises.push(created)

      return store.workouts[index]
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
