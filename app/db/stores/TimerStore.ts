import { types, Instance, SnapshotOut } from 'mobx-state-tree'
import { TimerModel } from '../models/Timer'

export const timerKey = 'defaultTimer'

// Store to handle the timer context and stateStore interaction
export const TimerStoreModel = types.model('TimerStore', {
  timers: types.optional(types.map(TimerModel), {
    [timerKey]: TimerModel.create({ id: timerKey }),
  }),
})

export interface TimerStore extends Instance<typeof TimerStoreModel> {}
export interface TimerStoreSnapshot
  extends SnapshotOut<typeof TimerStoreModel> {}
