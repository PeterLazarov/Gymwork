import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseStoreModel } from './ExerciseStore'
import { StateStoreModel } from './StateStore'
import { WorkoutStoreModel } from './WorkoutStore'
import { RecordStoreModel } from './RecordStore'
import { Exercise } from 'app/db/models'

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    stateStore: types.optional(StateStoreModel, {}),
    recordStore: types.optional(RecordStoreModel, {}),
  })
  .views(self => ({
    get openedWorkoutExercises() {
      return self.stateStore.openedWorkout?.exercises || []
    },
  }))
  .actions(self => ({
    initializeStores(): Promise<void>  {
      return self.exerciseStore.fetch()
        .then(() => self.workoutStore.fetch()
        .then(() => self.recordStore.fetch()))
    }
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
