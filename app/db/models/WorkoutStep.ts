import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'
import { WorkoutSetModel } from './WorkoutSet'
import { ExerciseModel } from './Exercise'

export const WorkoutStepModel = types
  .model('WorkoutStep')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    sets: types.array(WorkoutSetModel),
    exercise: types.reference(ExerciseModel)
  })
  .actions(withSetPropAction)

export interface WorkoutStep extends Instance<typeof WorkoutStepModel> {}
export interface WorkoutStepSnapshotOut
  extends SnapshotOut<typeof WorkoutStepModel> {}
export interface WorkoutStepSnapshotIn
  extends SnapshotIn<typeof WorkoutStepModel> {}
