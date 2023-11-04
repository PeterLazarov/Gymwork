import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseStoreModel } from './ExerciseStore'
import { WorkoutStoreModel } from './WorkoutStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  exerciseStore: types.optional(ExerciseStoreModel, {}),
  workoutStore: types.optional(WorkoutStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
