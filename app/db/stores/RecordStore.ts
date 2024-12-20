import { Instance, SnapshotOut, getParent, types } from 'mobx-state-tree'
import { keepAlive } from 'mobx-utils'

import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import {
  Exercise,
  ExerciseRecordModel,
  ExerciseRecordSnapshotIn,
  ExerciseRecord,
  WorkoutSet,
  WorkoutStep,
} from 'app/db/models'
import { getRecords } from 'app/db/seeds/exercise-records-seed-generator'
import * as storage from 'app/utils/storage'
import { markWeakAssRecords } from 'app/utils/workoutRecordsCalculator'

import { RootStore } from './RootStore'

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
      if (self.records.length === 0) {
        const records =
          await storage.load<ExerciseRecordSnapshotIn[]>('records')

        console.log('records in memory', records)
        if (records && records?.length > 0) {
          self.setProp('records', records)
        } else {
          await this.determineRecords()
        }
      }
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
