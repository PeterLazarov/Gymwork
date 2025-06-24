import { Instance, SnapshotOut, getParent, types } from 'mobx-state-tree'
import { keepAlive } from 'mobx-utils'

import { withSetPropAction } from '../helpers/withSetPropAction.ts'
import {
  Exercise,
  ExerciseRecordModel,
  ExerciseRecordSnapshotIn,
  ExerciseRecord,
  WorkoutSet,
  WorkoutStep,
} from '../models/index.ts'
import { getRecords } from '../seeds/exercise-records-seed-generator.ts'
import { markWeakAssRecords } from '../../utils/workoutRecordsCalculator.ts'

import { RootStore } from './RootStore.ts'

export const RecordStoreModel = types
  .model('RecordStore')
  .props({
    records: types.array(ExerciseRecordModel),
  })
  .views(store => ({
    get rootStore(): RootStore {
      return getParent(store) as RootStore
    },
    get exerciseRecordsMap() {
      const map: Record<Exercise['guid'], ExerciseRecord> = {}

      store.records.forEach(record => {
        map[record.exercise.guid] = record
      })
      return map
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    initialize() {
      keepAlive(self, 'exerciseRecordsMap')
    },
    async fetch() {
      await this.determineRecords()
    },
    async determineRecords() {
      console.log('calculating records')
      const allWorkouts = self.rootStore.workoutStore.workouts
      const records = getRecords(allWorkouts)

      self.setProp('records', records)
      self.records.forEach(record => markWeakAssRecords(record))
    },
    runSetUpdatedCheck(updatedSet: WorkoutSet) {
      let records = self.exerciseRecordsMap[updatedSet.exercise.guid]

      if (!records) {
        records = ExerciseRecordModel.create({
          exercise: updatedSet.exercise.guid,
          recordSets: [],
        })
        self.records.push(records)
      }

      if (records.isNewRecord(updatedSet)) {
        records.setNewRecord(updatedSet)
      }

      markWeakAssRecords(records)
    },
    getRecordsForStep(step: WorkoutStep) {
      const recordSets = step.exercises
        .flatMap<WorkoutSet>(
          ({ guid }) => self.exerciseRecordsMap[guid]?.recordSets || []
        )
        .filter(
          ({ isWeakAssRecord, completed }) => !isWeakAssRecord && completed
        )

      return recordSets
    },
  }))

export interface RecordStore extends Instance<typeof RecordStoreModel> {}
export interface RecordStoreSnapshot
  extends SnapshotOut<typeof RecordStoreModel> {}
