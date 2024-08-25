import {
  Instance,
  SnapshotOut,
  getParent,
  getSnapshot,
  types,
} from 'mobx-state-tree'

import * as storage from 'app/utils/storage'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import { 
  Exercise, 
  ExerciseRecordModel, 
  ExerciseRecordSnapshotIn, 
  ExerciseRecord, 
  WorkoutSet,
} from 'app/db/models'
import { getRecords } from 'app/db/seeds/exercise-records-seed-generator'
import { 
  updateRecordsWithLatestBest,
  isNewRecord,
  removeWeakAssRecords,
  updateRecordsIfNecessary
} from 'app/services/workoutRecordsCalculator'
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

      self.setProp('records', records)
    },
    getExerciseRecords(
      exerciseID: Exercise['guid']
    ): ExerciseRecord
     {
      let exerciseRecords = self.records.find(record => record.exercise.guid === exerciseID)

      if (exerciseRecords) {
        if (exerciseRecords.recordSets.length > 0) {
          removeWeakAssRecords(exerciseRecords)
        }
      }
      else {
        exerciseRecords = ExerciseRecordModel.create({
          exercise: exerciseID,
          recordSets: []
        })
        self.records.push(exerciseRecords)
      }

      return exerciseRecords
    },
    runSetUpdatedCheck(updatedSet: WorkoutSet) {
      const records = this.getExerciseRecords(updatedSet.exercise.guid)

      const isNewRecordBool = isNewRecord(records.recordSets, updatedSet)
      if (isNewRecordBool) {
        const updatedRecords = updateRecordsWithLatestBest(records.recordSets, updatedSet)
       
        records.setProp('recordSets', updatedRecords)
      }
    },
    recalculateGroupingRecordsForExercise (
      groupingToRefresh: number,
      oldExerciseRecords: ExerciseRecord, 
    ) {
      let refreshedRecords = oldExerciseRecords.recordSets.filter(recordSet => {
        return recordSet.groupingValue !== groupingToRefresh
      })

      const sortedWorkouts = self.rootStore.workoutStore.sortedWorkouts
      sortedWorkouts.forEach(workout => {
        workout.sets.forEach(set => {
          if (set.exercise.guid === oldExerciseRecords.exercise.guid && set.groupingValue === groupingToRefresh) {
            refreshedRecords = updateRecordsIfNecessary(refreshedRecords, set)
          }
        })
      })

      const refreshedRecordSnapshots = refreshedRecords.map(record => getSnapshot(record))
      oldExerciseRecords.setProp('recordSets', refreshedRecordSnapshots)
    }
  }))

export interface RecordStore extends Instance<typeof RecordStoreModel> {}
export interface RecordStoreSnapshot
  extends SnapshotOut<typeof RecordStoreModel> {}
