import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseStoreModel } from './ExerciseStore'
import { TimeStoreModel } from './TimeStore'
import { WorkoutStoreModel } from './WorkoutStore'
import { Exercise } from '../models'

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    timeStore: types.optional(TimeStoreModel, {}),
  })
  .views(self => ({
    get openedExercise(): Exercise | undefined {
      return self.exerciseStore.exercises.find(
        e => e.guid === self.workoutStore.openedExerciseGuid
      )
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(self.workoutStore.exerciseWorkouts)
        .map(id => self.exerciseStore.exercises.find(e => e.guid === id))
        .filter(Boolean)
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
