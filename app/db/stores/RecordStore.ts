import {
  Instance,
  SnapshotOut,
  getParent,
  types,
} from 'mobx-state-tree'

import * as storage from 'app/utils/storage'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import { Exercise, ExerciseRecordModel, ExerciseRecordSnapshotIn, ExerciseRecord, WorkoutSet } from 'app/db/models'
import { getRecords } from 'app/db/seeds/exercise-records-seed-generator'
import { addToRecords, getRecordsForExercise, isCurrentRecord, isNewRecord, removeWeakAssRecords } from 'app/services/workoutRecordsCalculator'
import { RootStore } from './RootStore'

export const RecordStoreModel = types
  .model('RecordStore')
  .props({
    records: types.array(ExerciseRecordModel),
  })
  .views( store => ({
      get rootStore(): RootStore {
        return getParent(store) as RootStore
      },
    })
  )
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
      const records = getRecords( allWorkouts)

      self.records.push(...records)
    },
    getExerciseRecords(
      exerciseID: Exercise['guid']
    ): ExerciseRecord
     {
      const exerciseRecords =  self.records.find(record => record.exercise.guid === exerciseID)!

      if (exerciseRecords.recordSets.length > 0) {
        console.log('removing weak ass sets for exercise ', exerciseRecords.exercise.name)
        removeWeakAssRecords(exerciseRecords)

        exerciseRecords.recordSets.sort((setA, setB) => setA.groupingValue - setB.groupingValue);
      }
      
      return exerciseRecords
    },
    runSetUpdatedCheck(updatedSet: WorkoutSet, workoutDate: string) {
      const records = this.getExerciseRecords(updatedSet.exercise.guid)

      if (isNewRecord(records.recordSets, updatedSet)) {
        const updatedRecords = addToRecords(records.recordSets, updatedSet, workoutDate)
       
        records.setProp('recordSets', updatedRecords)
      }
    },
    runSetDeletedRefreshCheck(deletedSet: WorkoutSet, exercise: Exercise) {
      const records = this.getExerciseRecords(exercise.guid)
      const isRecordBool = isCurrentRecord(records, deletedSet)

      if (isRecordBool) {
        const allWorkouts = self.rootStore.workoutStore.workouts
        // TODO: recalculate records only for the grouping of deleted set
        const refreshedRecords = getRecordsForExercise(exercise, allWorkouts)
        records.setProp('recordSets', refreshedRecords.recordSets)
      }
    }
  }))

export interface WorkoutStore extends Instance<typeof RecordStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof RecordStoreModel> {}
