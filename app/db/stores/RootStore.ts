import pkg from 'mobx-state-tree'
const { Instance, SnapshotOut, types } = pkg

import { withSetPropAction } from '../helpers/withSetPropAction.ts'

import { ExerciseStoreModel } from './ExerciseStore.ts'
import { RecordStoreModel } from './RecordStore.ts'
import { SettingsStoreModel } from './SettingsStore.ts'
import { StateStoreModel } from './StateStore.ts'
import { TimerStoreModel } from './TimerStore.ts'
import { WorkoutStoreModel } from './WorkoutStore.ts'

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    stateStore: types.optional(StateStoreModel, {}),
    recordStore: types.optional(RecordStoreModel, {}),
    settingsStore: types.optional(SettingsStoreModel, {}),
    timerStore: types.optional(TimerStoreModel, {}),
  })
  .actions(withSetPropAction)
  .actions(self => ({
    applySnapshot(snapshot: RootStoreSnapshot) {
      self.setProp('exerciseStore', snapshot.exerciseStore)
      self.setProp('workoutStore', snapshot.workoutStore)
      self.setProp('recordStore', snapshot.recordStore)
      self.setProp('settingsStore', snapshot.settingsStore)
      self.stateStore.applySnapshot(snapshot.stateStore)
    },
    initializeStores(): Promise<void> {
      return self.exerciseStore
        .fetch()
        .then(() => self.workoutStore.fetch())
        .then(() => self.recordStore.fetch())
        .then(() => self.stateStore.initialize())
        .then(() => self.settingsStore.initialize())
        .then(() => self.recordStore.initialize())
        .then(() => self.timerStore.initialize())
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
