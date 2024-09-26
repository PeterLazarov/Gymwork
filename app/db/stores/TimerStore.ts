import { types, Instance, SnapshotOut, getParent } from 'mobx-state-tree'
import { TimerModel } from '../models/Timer'
import { RootStore } from './RootStore'
import { reaction } from 'mobx'

export const restTimerKey = 'defaultTimer'
export const durationTimerKey = 'durationTimer'

// Store to handle the timer context and stateStore interaction
export const TimerStoreModel = types
  .model('TimerStore', {
    timers: types.optional(types.map(TimerModel), {
      [restTimerKey]: TimerModel.create({ id: restTimerKey }),
      [durationTimerKey]: TimerModel.create({ id: durationTimerKey }),
    }),
  })
  // TODO replace this with superset support
  .actions(self => {
    const rootStore = getParent(self) as RootStore
    const { stateStore } = rootStore
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const restTimer = self.timers.get(restTimerKey)!

    let lastStep = stateStore.focusedStepGuid

    return {
      afterAttach() {
        reaction(
          () => stateStore.focusedStepGuid,
          focusedStepGuid => {
            if (!lastStep) {
              lastStep = stateStore.focusedStepGuid
              return
            }

            if (focusedStepGuid && focusedStepGuid !== lastStep) {
              lastStep = focusedStepGuid
              restTimer.clear()
            }
          }
        )
      },
    }
  })

export interface TimerStore extends Instance<typeof TimerStoreModel> {}
export interface TimerStoreSnapshot
  extends SnapshotOut<typeof TimerStoreModel> {}
