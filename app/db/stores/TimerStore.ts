/* eslint-disable @typescript-eslint/no-non-null-assertion */
import convert from 'convert-units'
import { difference } from 'lodash'
import { Duration } from 'luxon'
import { reaction } from 'mobx'
import { types, Instance, SnapshotOut, getParent } from 'mobx-state-tree'

import { withSetPropAction } from 'app/db/helpers/withSetPropAction'

import { Exercise } from '../models'
import { TimerModel } from '../models/Timer'

import { RootStore } from './RootStore'

// TODO dedupe
const defaultDelay = convert(30).from('min').to('ms')

// Store to handle the timer context and stateStore interaction
export const TimerStoreModel = types
  .model('TimerStore', {
    exerciseTimers: types.optional(types.map(TimerModel), {}),

    workoutTimer: types.optional(TimerModel, { id: 'workout' }),

    workoutTimerStartOnFirstSet: true,
    workoutTimerEndWorkoutDelayMs: defaultDelay,
    workoutTimerSnapEndToLastSet: true,
  })

  .actions(self => {
    const rootStore = getParent(self) as RootStore
    const { stateStore } = rootStore

    let dispose: Function[] = []

    // TODO refactor
    function startStopOrUpdateWorkoutTimer(isToday: boolean | undefined) {
      const workout = stateStore.openedWorkout

      if (!workout) {
        self.workoutTimer.stop()
        self.workoutTimer.clear()
        return
      }

      if (!isToday) {
        self.workoutTimer.setTimeElapsed(
          workout.duration ?? Duration.fromMillis(0)
        )
        self.workoutTimer.stop()
        return
      }

      const workoutStart = workout.firstAddedSet?.createdAt
      const workoutEnd = workout.endedAt

      if (!workoutStart) {
        self.workoutTimer.stop()
        self.workoutTimer.clear()
        return
      }

      if (workoutEnd) {
        self.workoutTimer.setTimeElapsed(
          Duration.fromMillis(workoutEnd.getTime() - workoutStart.getTime())
        )
        self.workoutTimer.stop()
      } else {
        self.workoutTimer.setTimeElapsed(
          Duration.fromMillis(Date.now() - workoutStart.getTime())
        )
        self.workoutTimer.resume()
      }
    }

    return {
      initialize() {
        this.setExerciseTimers(stateStore.openedWorkout?.exercises)
        startStopOrUpdateWorkoutTimer(stateStore.openedWorkout?.isToday)
      },

      // An action so that it can modify props
      setExerciseTimers(exercises: Exercise[] = []) {
        const currentTimers = [...self.exerciseTimers.keys()]
        const exerciseIds = exercises.map(({ guid }) => guid)
        const exerciseTimerIds = exerciseIds.map(id => `timer_${id}`)

        difference(currentTimers, exerciseTimerIds).forEach(id => {
          self.exerciseTimers.delete(id)
        })

        difference(exerciseTimerIds, currentTimers).forEach(id => {
          self.exerciseTimers.put({ id })
        })
      },
      afterAttach() {
        dispose = [
          reaction(
            () => stateStore.openedWorkout?.exercises,
            this.setExerciseTimers,
            {
              onError() {
                // TODO check why this happens
                // [mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: 'Reaction[Reaction@7712]' [TypeError: cyclical structure in JSON object]
              },
            }
          ),

          reaction(
            () => stateStore.openedWorkout?.isToday,
            startStopOrUpdateWorkoutTimer
          ),

          // On adding set, unEnd workout
          reaction(
            () => stateStore.openedWorkout?.allSets,
            () => {
              const workout = stateStore.openedWorkout
              if (
                workout?.isToday &&
                workout.lastAddedSet &&
                workout.endedAt &&
                workout.endedAt?.getTime() <
                  (workout.lastAddedSet?.createdAt.getTime() ?? 0)
              ) {
                workout.setProp('endedAt', undefined)
              }
            }
          ),

          // on delay, end workout, snapping to last set
          reaction(
            () => self.workoutTimer?.timeElapsedMillis,
            elapsed => {
              const w = stateStore.openedWorkout

              if (!w?.isToday) return
              if (w?.endedAt) return

              const createdAt = w.firstAddedSet?.createdAt?.getTime()
              const lastSetCreatedAt = w.lastAddedSet?.createdAt?.getTime()

              if (
                createdAt &&
                lastSetCreatedAt &&
                elapsed - createdAt > defaultDelay
              ) {
                w.setProp('endedAt', new Date(lastSetCreatedAt))
              }
            }
          ),
        ]
      },
      beforeDestroy() {
        dispose.forEach(fn => fn())
      },
    }
  })
  .actions(withSetPropAction)

export interface TimerStore extends Instance<typeof TimerStoreModel> {}
export interface TimerStoreSnapshot
  extends SnapshotOut<typeof TimerStoreModel> {}
