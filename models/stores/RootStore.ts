import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { EpisodeStoreModel } from './EpisodeStore' // @demo remove-current-line
import { ExerciseStoreModel } from './ExerciseStore'
import { WorkoutStoreModel } from './WorkoutStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  episodeStore: types.optional(EpisodeStoreModel, {}),
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
