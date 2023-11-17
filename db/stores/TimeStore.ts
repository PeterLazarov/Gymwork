import { DateTime } from 'luxon'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'

let stopwatchInterval: NodeJS.Timeout

export const TimeStoreModel = types
  .model('TimeStore')
  .props({
    stopwatchRunning: false,
    stopwatchPaused: false,
    stopwatchPausedTime: 0,
    startOrUnpauseTime: '',
    stopwatchValue: '',
  })
  .actions(store => ({
    startStopwatch() {
      store.stopwatchRunning = true
      store.stopwatchPaused = false
      store.startOrUnpauseTime = DateTime.now().toISOTime()!

      stopwatchInterval = setInterval(this._tickStopwatch, 1000)
    },
    pauseStopwatch() {
      store.stopwatchRunning = false
      store.stopwatchPaused = true

      clearInterval(stopwatchInterval)
      const currentTime = DateTime.local()
      store.stopwatchPausedTime += currentTime.diff(
        DateTime.fromISO(store.startOrUnpauseTime),
        'milliseconds'
      ).milliseconds
    },
    stopStopwatch() {
      store.stopwatchRunning = false
      store.stopwatchPaused = false
      store.stopwatchPausedTime = 0
      store.stopwatchValue = ''

      clearInterval(stopwatchInterval)
    },
    _tickStopwatch() {
      const currentTime = DateTime.local()
      const luxonStartOrUnpauseTime = DateTime.fromISO(store.startOrUnpauseTime)
      const elapsedTime = currentTime
        .diff(luxonStartOrUnpauseTime, 'milliseconds')
        .plus(store.stopwatchPausedTime)
        .toISOTime({ suppressMilliseconds: true })!

      store.stopwatchValue = elapsedTime
    },
  }))

export interface TimeStore extends Instance<typeof TimeStoreModel> {}
export interface TimeStoreSnapshot extends SnapshotOut<typeof TimeStoreModel> {}
