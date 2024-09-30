/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { types, Instance, SnapshotOut, getParent } from 'mobx-state-tree'
import { TimerModel } from '../models/Timer'
import { RootStore } from './RootStore'
import { reaction } from 'mobx'
import { DateTime, Duration } from 'luxon'
import { difference } from 'lodash'
import { Exercise } from '../models'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import convert from 'convert-units'

const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
const defaultDelay = convert(30).from('min').to('ms')

// Store to handle the timer context and stateStore interaction
export const TimerStoreModel = types
  .model('TimerStore', {
    timers: types.optional(types.map(TimerModel), {
      workout: TimerModel.create({ id: 'workout' }),
    }),

    // TODO utilize settings
    workoutTimerStartOnFirstSet: true,
    workoutTimerEndWorkoutDelayMs: defaultDelay,
    workoutTimerSnapEndToLastSet: true,
  })
  .views(self => ({
    get workoutTimer() {
      return self.timers.get('workout')!
    },
  }))
  // TODO replace this with superset support
  .actions(self => {
    const rootStore = getParent(self) as RootStore
    const { workoutStore, stateStore } = rootStore

    let dispose: Function[] = []

    // TODO refactor
    function startStopOrUpdateWorkoutTimer(isToday: boolean | undefined) {
      const workout = stateStore.openedWorkout

      if (!workout || !isToday) {
        self.workoutTimer.stop()
        self.workoutTimer.clear()
        return
      }

      const workoutStart = workout.firstSet?.createdAt
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

    function setExerciseTimers(exercises: Exercise[] = []) {
      const currentTimers = [...self.timers.keys()]
      const exerciseIds = exercises.map(({ guid }) => guid)

      difference(currentTimers, exerciseIds).forEach(id => {
        self.timers.delete(`timer_${id}`)
      })

      difference(exerciseIds, currentTimers).forEach(id => {
        self.timers.put({ id: `timer_${id}` })
      })
    }

    return {
      initialize() {
        setExerciseTimers(
          workoutStore.dateWorkoutMap[today.toISODate()]?.exercises
        )
        startStopOrUpdateWorkoutTimer(stateStore.openedWorkout?.isToday)
      },

      afterAttach() {
        dispose = [
          reaction(
            () => workoutStore.dateWorkoutMap[today.toISODate()]?.exercises,
            setExerciseTimers,
            {
              onError(e) {
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
            () => stateStore.openedWorkout,
            w => {
              if (
                w?.isToday &&
                w.lastSet &&
                w.endedAt &&
                w.endedAt?.getTime() < (w.lastSet?.createdAt.getTime() ?? 0)
              ) {
                w.setProp('endedAt', undefined)
              }
            }
          ),

          // on delay, end workout, snapping to last set
          reaction(
            () => self.workoutTimer.timeElapsedMillis,
            elapsed => {
              const w = stateStore.openedWorkout

              if (!w?.isToday) return
              if (w?.endedAt) return

              const createdAt = w.firstSet?.createdAt?.getTime()
              const lastSetCreatedAt = w.lastSet?.createdAt?.getTime()

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
