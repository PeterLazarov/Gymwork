import {
  Instance,
  SnapshotOut,
  addDisposer,
  getParent,
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
  WorkoutStep,
} from 'app/db/models'
import { getRecords } from 'app/db/seeds/exercise-records-seed-generator'
import { RootStore } from './RootStore'
import { autorun } from 'mobx'

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
    getRecordsForStep(step: WorkoutStep) {
      const recordSets = step.exercises
        .flatMap<WorkoutSet>(
          ({ guid }) => self.exerciseRecordsMap[guid]?.recordSets || []
        )
        .filter(({ isWeakAssRecord }) => !isWeakAssRecord)

      return recordSets
    },
  }))
  // A keepAlive hack
  // https://github.com/mobxjs/mobx-state-tree/issues/1949
  .actions(self => ({
    afterAttach() {
      addDisposer(
        self,
        autorun(() => {
          const x = self.exerciseRecordsMap // this simple method of making sure to access self.mySlowMethod keeps the slow getter alive. you can alternatively not console.log it and do something else with it if needed, just make sure to access it in an autorun
        })
      )
    },
  }))

export interface RecordStore extends Instance<typeof RecordStoreModel> {}
export interface RecordStoreSnapshot
  extends SnapshotOut<typeof RecordStoreModel> {}
