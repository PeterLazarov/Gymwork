import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
  // getIdentifier,
} from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'

import { withMergeUpdateAction } from '../helpers/withMergeUpdateAction.ts'
import { withSetPropAction } from '../helpers/withSetPropAction.ts'

import { WorkoutStepModel } from './WorkoutStep.ts'

export const WorkoutTemplateModel = types
  .model('WorkoutTemplate')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: '',
    steps: types.array(WorkoutStepModel),
  })
  .actions(withSetPropAction)
  .actions(withMergeUpdateAction)

export interface WorkoutTemplate
  extends Instance<typeof WorkoutTemplateModel> {}
export interface WorkoutTemplateSnapshotOut
  extends SnapshotOut<typeof WorkoutTemplateModel> {}
export interface WorkoutTemplateSnapshotIn
  extends SnapshotIn<typeof WorkoutTemplateModel> {}
