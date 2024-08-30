import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'
import { WorkoutSetModel } from './WorkoutSet'
import { Exercise } from './Exercise'
import { uniqueValues } from 'app/utils/array'

const WorkoutStepType = {
  StraightSets: 'staightsets',
  SuperSet: 'superset',
} as const

export const WorkoutStepModel = types
  .model('WorkoutStep')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    sets: types.array(WorkoutSetModel),
    type: types.enumeration(
      'WorkoutStepType',
      Object.values(WorkoutStepType)
    ),
  })
  .views(step => ({
    get exercises(): Exercise[] {
      return uniqueValues(step.sets.map(s => s.exercise))
    },
    get exercise(): Exercise | null {
      return step.type === 'staightsets' ? this.exercises[0] : null
    }
  }))
  .actions(withSetPropAction)

export interface WorkoutStep extends Instance<typeof WorkoutStepModel> {}
export interface WorkoutStepSnapshotOut
  extends SnapshotOut<typeof WorkoutStepModel> {}
export interface WorkoutStepSnapshotIn
  extends SnapshotIn<typeof WorkoutStepModel> {}
