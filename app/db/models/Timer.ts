import { setDriftlessInterval, clearDriftless } from 'driftless'
import { Duration } from 'luxon'
import { reaction } from 'mobx'
import pkg from 'mobx-state-tree'
const { Instance, SnapshotIn, SnapshotOut, types } = pkg
import { keepAlive } from 'mobx-utils'
// import { Vibration } from 'react-native'

import { withSetPropAction } from '../helpers/withSetPropAction.ts'

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
      return Duration.fromMillis(timeLeftMillis)
    },
  }))
  .actions(withSetPropAction)
  .actions(self => {
    // Store cleanup functions
    const disposers = new Set<() => void>()

    // Keep isRunning alive
    disposers.add(keepAlive(self, 'isRunning'))

    let lastTickAt = Date.now() // Timestamp of the last tick
    let didVibrate = false

    // Add reaction to disposers
    disposers.add(
      reaction(
        () => self.duration,
        newDuration => {
          if (newDuration.toMillis() < self.timeElapsedMillis) {
            didVibrate = false
          }
        }
      )
    )

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
      if (
        self.inCountdownMode &&
        self.timeLeft.toMillis() <= 0 &&
        !didVibrate
      ) {
        // Vibration.vibrate(1000) // TODO make this work
        didVibrate = true
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
        didVibrate = false
        self.timeElapsedMillis = 0
      },
      setTimeElapsed(newDuration: Duration) {
        self.timeElapsedMillis = newDuration.toMillis()
      },
      setDuration(newDuration: Duration) {
        // Prevent negative durations
        const milliseconds = Math.max(0, newDuration.toMillis())
        self.durationMillis = milliseconds
      },
      beforeDestroy() {
        this.stop()
        // Cleanup all reactions and keepAlive
        disposers.forEach(dispose => dispose())
      },
    }
  })

export interface Timer extends Instance<typeof TimerModel> {}
export interface TimerModelSnapshotOut extends SnapshotOut<typeof TimerModel> {}
export interface TimerModelSnapshotIn extends SnapshotIn<typeof TimerModel> {}
