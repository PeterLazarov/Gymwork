import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const TimeStoreModel = types
  .model('TimeStore')
  .props({
    stopwatchRunning: false,
    stopwatchPaused: false,
    stopwatchValue: '',
  })
  .actions(store => ({
    startStopwatch() {
      store.stopwatchRunning = true
      store.stopwatchPaused = false
    },
    pauseStopwatch() {
      store.stopwatchRunning = false
      store.stopwatchPaused = true
    },
    stopStopwatch() {
      store.stopwatchRunning = false
      store.stopwatchPaused = false
    },
  }))

export interface TimeStore extends Instance<typeof TimeStoreModel> {}
export interface TimeStoreSnapshot extends SnapshotOut<typeof TimeStoreModel> {}
