import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'
import { ExerciseModel } from './Exercise'
import { WorkoutSet, WorkoutSetModel } from './WorkoutSet'

export const ExerciseRecordModel = types
  .model('ExerciseRecord')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    recordSets: types.array(WorkoutSetModel),
  })
  .views(self => ({
    get recordSetsMap () {
      const map: Record<string, WorkoutSet> = {};

      self.recordSets.forEach(record => {
        map[record.guid] = record;
      });
      return map
    }
  }))
  .actions(withSetPropAction)

export interface ExerciseRecord extends Instance<typeof ExerciseRecordModel> {}
export interface ExerciseRecordSnapshotOut
  extends SnapshotOut<typeof ExerciseRecordModel> {}
export interface ExerciseRecordSnapshotIn extends SnapshotIn<typeof ExerciseRecordModel> {}
