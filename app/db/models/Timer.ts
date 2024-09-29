import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { Duration } from 'luxon'
import { setDriftlessInterval, clearDriftless } from 'driftless'
import { Vibration } from 'react-native'
import { withSetPropAction } from '../helpers/withSetPropAction'

// Default durations
const defaultDuration = Duration.fromDurationLike({ minutes: 0 })
const defaultUpdateFrequency = Duration.fromMillis(1000)

export const TimerModel = types
  .model('Timer', {
    /** The ID of the related entity */
    id: types.identifier,
    timeElapsedMillis: 0,
    durationMillis: defaultDuration.toMillis(),

    type: types.optional(
      types.enumeration(['rest', 'duration'] as const),
      'rest'
    ),
  })
  .volatile(self => {
    return {
      intervalHandle: null as null | number,
    }
  })
  .views(self => ({
    get isRunning() {
      return self.intervalHandle !== null
    },
    get inCountdownMode() {
      return self.durationMillis !== 0
    },
    get timeElapsed() {
      return Duration.fromMillis(self.timeElapsedMillis)
    },
    get duration() {
      return Duration.fromMillis(self.durationMillis)
    },
    get timeLeft() {
      const timeLeftMillis = self.durationMillis - self.timeElapsedMillis
      return Duration.fromMillis(Math.abs(timeLeftMillis))
    },
  }))
  .actions(withSetPropAction)
  .actions(self => {
    let lastTickAt = Date.now() // Timestamp of the last tick

    // Update state for ticking
    const tick = () => {
      const now = Date.now()
      const timePassedSinceLastTick = Duration.fromMillis(now - lastTickAt)
      lastTickAt = now
      self.setProp(
        'timeElapsedMillis',
        self.timeElapsedMillis + timePassedSinceLastTick.toMillis()
      )

      // Vibrate if countdown is over
      if (self.inCountdownMode && self.timeLeft.toMillis() <= 0) {
        Vibration.vibrate([500, 200, 500]) // TODO make this work
      }
    }

    // Start interval with optional frequency
    const startTickInterval = (
      updateFrequency: Duration = defaultUpdateFrequency
    ) => {
      if (self.intervalHandle === null) {
        lastTickAt = Date.now()
        // TODO?
        self.intervalHandle = setDriftlessInterval(
          tick,
          updateFrequency.toMillis()
        )
      }
    }

    return {
      start() {
        self.timeElapsedMillis = 0
        startTickInterval()
      },
      resume() {
        startTickInterval()
      },
      stop() {
        if (self.intervalHandle !== null) {
          clearDriftless(self.intervalHandle)
          tick() // Final tick before stopping
          self.intervalHandle = null
        }
      },
      clear() {
        this.stop()
        self.timeElapsedMillis = 0
      },
      setTimeElapsed(newDuration: Duration) {
        self.timeElapsedMillis = newDuration.toMillis()
      },
      setDuration(newDuration: Duration) {
        self.durationMillis = newDuration.toMillis()
      },
      afterCreate() {
        // Stop timer when the model is destroyed
        return () => this.stop()
      },
    }
  })

export interface Timer extends Instance<typeof TimerModel> {}
export interface TimerModelSnapshotOut extends SnapshotOut<typeof TimerModel> {}
export interface TimerModelSnapshotIn extends SnapshotIn<typeof TimerModel> {}
