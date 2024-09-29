/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { types, Instance, SnapshotOut, getParent } from 'mobx-state-tree'
import { TimerModel } from '../models/Timer'
import { RootStore } from './RootStore'
import { reaction } from 'mobx'
import { DateTime } from 'luxon'
import { difference } from 'lodash'
import { Exercise } from '../models'

const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })

// Store to handle the timer context and stateStore interaction
export const TimerStoreModel = types
  .model('TimerStore', {
    timers: types.optional(types.map(TimerModel), {}),
  })
  // TODO replace this with superset support
  .actions(self => {
    const rootStore = getParent(self) as RootStore
    const { workoutStore } = rootStore

    let dispose: Function

    return {
      initialize() {
        this.updateTimers(
          workoutStore.dateWorkoutMap[today.toISODate()]?.exercises
        )
      },
      updateTimers(exercises: Exercise[] = []) {
        const currentTimers = [...self.timers.keys()]
        const exerciseIds = exercises.map(({ guid }) => guid)

        difference(currentTimers, exerciseIds).forEach(id => {
          self.timers.delete(`timer_${id}`)
        })

        difference(exerciseIds, currentTimers).forEach(id => {
          self.timers.put({ id: `timer_${id}` })
        })
      },
      afterAttach() {
        dispose = reaction(
          () => workoutStore.dateWorkoutMap[today.toISODate()]?.exercises,
          this.updateTimers
        )
      },
      beforeDestroy() {
        dispose?.()
      },
    }
  })

export interface TimerStore extends Instance<typeof TimerStoreModel> {}
export interface TimerStoreSnapshot
  extends SnapshotOut<typeof TimerStoreModel> {}
