import { DateTime } from 'luxon'
import { Instance, SnapshotOut, getParent, types } from 'mobx-state-tree'
import { Vibration } from 'react-native'

import { RootStore } from './RootStore'

let stopwatchInterval: NodeJS.Timeout
let timerInterval: NodeJS.Timeout

export const TimeStoreModel = types
  .model('TimeStore')
  .props({
    stopwatchRunning: false,
    stopwatchPaused: false,
    stopwatchPausedTime: 0,
    startOrUnpauseTime: '',
    stopwatchValue: '',
    timerRunning: false,
    timerTimeLeft: 0,
    timerValue: '',
  })
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self) as RootStore
    },
  }))
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

      store.stopwatchValue = elapsedTime.toFormat('hh:mm:ss')
    },

    startTimer() {
      store.timerTimeLeft = store.rootStore.stateStore.timerDurationSecs
      this._updateTimerSeconds()
      timerInterval = setInterval(this._tickTimer, 1000)
    },
    stopTimer() {
      clearInterval(timerInterval)
      store.timerRunning = false
      store.timerTimeLeft = store.rootStore.stateStore.timerDurationSecs
      this._updateTimerSeconds()
    },
    _tickTimer() {
      this._updateTimerSeconds()
      if (store.timerTimeLeft <= 0) {
        this.stopTimer()
        Vibration.vibrate([500, 200, 500])
      } else {
        store.timerTimeLeft--
      }
    },
    _updateTimerSeconds() {
      const minutes = Math.floor((store.timerTimeLeft % 3600) / 60)
      const seconds = store.timerTimeLeft % 60

      const formattedTime = `${minutes}:${seconds}`
      store.timerValue = formattedTime
    },
  }))

export interface TimeStore extends Instance<typeof TimeStoreModel> {}
export interface TimeStoreSnapshot extends SnapshotOut<typeof TimeStoreModel> {}
