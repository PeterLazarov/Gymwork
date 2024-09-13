import { Instance, SnapshotOut, getParent, types } from 'mobx-state-tree'

import * as storage from 'app/utils/storage'
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
import { markWeakAssRecords } from 'app/services/workoutRecordsCalculator'
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
    async fetch() {
      const records = await storage.load<ExerciseRecordSnapshotIn[]>('records')

      if (records && records?.length > 0) {
        self.setProp('records', records)
      } else {
        await this.seed()
      }
    },
    async seed() {
      console.log('seeding records')
      const allWorkouts = self.rootStore.workoutStore.workouts
      const records = getRecords(allWorkouts)

      self.setProp('records', records)
    },
    getMarkedExerciseRecords(exerciseID: Exercise['guid']): ExerciseRecord {
      const exerciseRecords = self.exerciseRecordsMap[exerciseID]!

      if (exerciseRecords && exerciseRecords.recordSets.length > 0) {
        markWeakAssRecords(exerciseRecords)
      }

      return exerciseRecords
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
    },
    getRecordGuidsForStep(step: WorkoutStep) {
      const recordSets = step.exercises
        .flatMap<WorkoutSet>(
          ({ guid }) => this.getMarkedExerciseRecords(guid)?.recordSets || []
        )
        .filter(({ isWeakAssRecord }) => !isWeakAssRecord)

      return recordSets
    },
  }))

export interface RecordStore extends Instance<typeof RecordStoreModel> {}
export interface RecordStoreSnapshot
  extends SnapshotOut<typeof RecordStoreModel> {}
