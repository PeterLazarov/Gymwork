import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'

import { WorkoutSetModel } from './WorkoutSet'
import { withSetPropAction } from './helpers/withSetPropAction'

export const WorkoutModel = types
  .model('Workout')
  .props({
    guid: types.identifier,
    date: '',
    notes: '',
    sets: types.array(WorkoutSetModel),
  })
  .actions(withSetPropAction)

export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
