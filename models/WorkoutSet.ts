import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseModel } from './Exercise'
import { withSetPropAction } from './helpers/withSetPropAction'

export const WorkoutSetModel = types
  .model('WorkoutSet')
  .props({
    guid: types.identifier,
    weight: 0,
    reps: 0,
    exercise: types.safeReference(ExerciseModel),
  })
  .actions(withSetPropAction)

export interface WorkoutSet extends Instance<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotOut
  extends SnapshotOut<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotIn
  extends SnapshotIn<typeof WorkoutSetModel> {}
