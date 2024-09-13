import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  addDisposer,
  destroy,
  getParentOfType,
  getSnapshot,
  types,
} from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { getDataFieldForKey } from 'app/services/workoutRecordsCalculator'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { ExerciseModel } from './Exercise'
import { WorkoutSet, WorkoutSetModel } from './WorkoutSet'
import { WorkoutStore } from '../stores/WorkoutStore'
import { RootStoreModel } from '../stores/RootStore'
import { autorun } from 'mobx'

export const ExerciseRecordModel = types
  .model('ExerciseRecord')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    recordSets: types.array(WorkoutSetModel),
  })
  .views(self => ({
    get workoutStore(): WorkoutStore {
      const rootStore = getParentOfType(self, RootStoreModel)
      return rootStore.workoutStore
    },
    get recordSetsMap() {
      const map: Record<string, WorkoutSet> = {}

      self.recordSets.forEach(record => {
        map[record.guid] = record
      })
      return map
    },
    get groupingRecordMap() {
      const map: Record<string, WorkoutSet> = {}

      self.recordSets.forEach(record => {
        map[record.groupingValue] = record
      })
      return map
    },
  }))
  .actions(withSetPropAction)
  .actions(exerciseRecords => ({
    isNewRecord(set: WorkoutSet) {
      const currentRecord = exerciseRecords.groupingRecordMap[set.groupingValue]
      return !currentRecord || set.isBetterThan(currentRecord)
    },
    setNewRecord(newRecord: WorkoutSet) {
      const currentRecord =
        exerciseRecords.groupingRecordMap[newRecord.groupingValue]

      const recordSets = exerciseRecords.recordSets.map(record =>
        getSnapshot(record)
      )
      const newRecordSnapshot = getSnapshot(newRecord)

      if (currentRecord) {
        const index = exerciseRecords.recordSets.indexOf(currentRecord)
        recordSets[index] = newRecordSnapshot
        destroy(currentRecord)
      } else {
        recordSets.push(newRecordSnapshot)
      }

      exerciseRecords.setProp('recordSets', recordSets)
    },
    recalculateGroupingRecords(groupingToRefresh: number) {
      const refreshedRecords = exerciseRecords.recordSets.filter(recordSet => {
        return recordSet.groupingValue !== groupingToRefresh
      })

      const grouping = getDataFieldForKey(
        exerciseRecords.exercise.groupRecordsBy
      )
      const exerciseSets =
        exerciseRecords.workoutStore.exerciseSetsHistoryMap[
          exerciseRecords.exercise.guid
        ] || []

      exerciseSets.forEach(set => {
        if (set.groupingValue === groupingToRefresh) {
          const currentRecordIndex = refreshedRecords!.findIndex(
            s => s[grouping] === set.groupingValue
          )
          if (currentRecordIndex !== -1) {
            const currentRecord = refreshedRecords[currentRecordIndex]
            if (set.isBetterThan(currentRecord)) {
              refreshedRecords[currentRecordIndex] = set
            }
          } else {
            refreshedRecords.push(set)
          }
        }
      })

      const refreshedRecordSnapshots = refreshedRecords.map(record =>
        getSnapshot(record)
      )
      exerciseRecords.setProp('recordSets', refreshedRecordSnapshots)
    },
  }))
  .actions(self => ({
    afterAttach() {
      addDisposer(
        self,
        autorun(() => {
          const x = self.recordSetsMap // this simple method of making sure to access self.mySlowMethod keeps the slow getter alive. you can alternatively not console.log it and do something else with it if needed, just make sure to access it in an autorun
          const y = self.groupingRecordMap
        })
      )
    },
  }))

export interface ExerciseRecord extends Instance<typeof ExerciseRecordModel> {}
export interface ExerciseRecordSnapshotOut
  extends SnapshotOut<typeof ExerciseRecordModel> {}
export interface ExerciseRecordSnapshotIn
  extends SnapshotIn<typeof ExerciseRecordModel> {}
