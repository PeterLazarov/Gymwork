import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import { ExerciseStoreModel } from './ExerciseStore'
import { StateStoreModel } from './StateStore'
import { WorkoutStoreModel } from './WorkoutStore'
import { RecordStoreModel } from './RecordStore'

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    stateStore: types.optional(StateStoreModel, {}),
    recordStore: types.optional(RecordStoreModel, {}),
  })
  .actions(withSetPropAction)
  .actions(self => ({
    applySnapshot(snapshot: RootStoreSnapshot) {
      self.setProp('exerciseStore', snapshot.exerciseStore)
      self.setProp('workoutStore', snapshot.workoutStore)
      self.setProp('recordStore', snapshot.recordStore)
    },
    initializeStores(): Promise<void> {
      return self.exerciseStore
        .fetch()
        .then(() =>
          self.workoutStore.fetch().then(() => self.recordStore.fetch())
        )
        .then(() => self.stateStore.initialize())
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
