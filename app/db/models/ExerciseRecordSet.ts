import { Instance, SnapshotIn, SnapshotOut, getParentOfType, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'
import { ExerciseRecord, ExerciseRecordModel } from './ExerciseRecord'
import convert from 'convert-units'

export const ExerciseRecordSetModel = types
  .model('ExerciseRecordSet')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    reps: 0,
    weightMcg: 0,
    distanceMm: 0, 
    durationMs: 0,
    date: '',
    isWeakAss: false
  })
  .views(self => ({
    get exerciseRecord(): ExerciseRecord {
      return getParentOfType(self, ExerciseRecordModel)
    },
    get measurementValue() {
      return self.weightMcg || self.durationMs || self.distanceMm
    },
    get groupingValue() {
      switch (this.exerciseRecord.exercise.groupRecordsBy) {
        case 'time':
          return self.durationMs
        case 'reps':
          return self.reps
        case 'weight':
          return self.weightMcg 
        case 'distance':
          return self.distanceMm 

        default:
          return 0
      }
    },
    get weight(): number {
      return Number(
        convert(self.weightMcg ?? 0)
          .from('mcg')
          .to(this.exerciseRecord.exercise.measurements.weight!.unit)
          .toFixed(2)
      )
    },
    get distance(): number {
      return Number(
        convert(self.distanceMm ?? 0)
          .from('mm')
          .to(this.exerciseRecord.exercise.measurements.distance!.unit)
          .toFixed(2)
      )
    },
    get duration(): number {
      return Number(
        convert(self.durationMs ?? 0)
          .from('ms')
          .to(this.exerciseRecord.exercise.measurements.time!.unit)
          .toFixed(2)
      )
    },
  }))
  .actions(withSetPropAction)
  

export interface ExerciseRecordSet extends Instance<typeof ExerciseRecordSetModel> {}
export interface ExerciseRecordSetSnapshotOut
  extends SnapshotOut<typeof ExerciseRecordSetModel> {}
export interface ExerciseRecordSetSnapshotIn extends SnapshotIn<typeof ExerciseRecordSetModel> {}
