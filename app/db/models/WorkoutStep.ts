import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  getParentOfType,
  getSnapshot,
  types,
} from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import { RootStoreModel } from 'app/db/stores/RootStore'
import { Exercise, ExerciseModel } from './Exercise'
import { WorkoutSet, WorkoutSetModel, WorkoutSetSnapshotIn } from './WorkoutSet'
import { RecordStore } from '../stores/RecordStore'
import { getDataFieldForKey } from 'app/utils/workoutRecordsCalculator'
import { alphabeticNumbering } from 'app/utils/string'
import { ExerciseRecord } from './ExerciseRecord'

const stepType = {
  straightSet: 'straightSet',
  superSet: 'superSet',
} as const

export const WorkoutStepModel = types
  .model('WorkoutStep')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    sets: types.array(WorkoutSetModel),
    exercises: types.array(types.reference(ExerciseModel)),
    type: types.enumeration(Object.values(stepType)),
  })
  .views(step => ({
    get recordStore(): RecordStore {
      const rootStore = getParentOfType(step, RootStoreModel)
      return rootStore.recordStore
    },
    get exerciseRecordsMap() {
      return step.exercises.reduce((map, exercise) => {
        map[exercise.guid] = this.recordStore.exerciseRecordsMap[exercise.guid]!
        return map
      }, {} as Record<Exercise['guid'], ExerciseRecord>)
    },
    get lastSet() {
      return step.sets.at(-1)
    },
    get workSets() {
      return step.sets.filter(s => !s.isWarmup)
    },
    get exercise() {
      return step.exercises[0]
    },
    get exerciseSetsMap() {
      return step.sets.reduce((map, set) => {
        if (!map[set.exercise.guid]) {
          map[set.exercise.guid] = []
        }
        map[set.exercise.guid]!.push(set)
        return map
      }, {} as Record<Exercise['guid'], WorkoutSet[]>)
    },
    get exerciseWorkSetsMap() {
      return step.sets.reduce((map, set) => {
        if (!set.isWarmup) {
          if (!map[set.exercise.guid]) {
            map[set.exercise.guid] = []
          }
          map[set.exercise.guid]!.push(set)
        }
        return map
      }, {} as Record<Exercise['guid'], WorkoutSet[]>)
    },
    get exerciseLettering(): Record<Exercise['guid'], string> {
      let map: Record<Exercise['guid'], string> = {}

      if (step.type === 'superSet') {
        map = step.exercises.reduce((map, e, i) => {
          map[e.guid] = alphabeticNumbering(i)
          return map
        }, {} as Record<Exercise['guid'], string>)
      }

      return map
    },
    get setNumberMap(): Record<WorkoutSet['guid'], number> {
      const map: Record<WorkoutSet['guid'], number> = {}

      step.exercises.forEach(exercise => {
        const workSets = this.exerciseWorkSetsMap[exercise.guid]

        workSets?.forEach((set, index) => {
          map[set.guid] = index + 1
        })
      })

      return map
    },
  }))
  .actions(withSetPropAction)
  .actions(step => ({
    addSet(newSet: WorkoutSet) {
      step.sets.push(newSet)
      step.recordStore.runSetUpdatedCheck(newSet)
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const deletedSetIndex = step.sets.findIndex(s => s.guid === setGuid)
      const deletedSet = step.sets[deletedSetIndex]
      if (deletedSet) {
        const { exercise } = deletedSet

        const records = step.exerciseRecordsMap[exercise.guid]!
        const isRecordBool =
          records?.recordSetsMap.hasOwnProperty(deletedSet.guid) || false

        const deletedSetSnapshot = getSnapshot(deletedSet)
        step.sets.splice(deletedSetIndex, 1)

        if (isRecordBool) {
          const grouping = getDataFieldForKey(exercise.groupRecordsBy)
          records.recalculateGroupingRecords(deletedSetSnapshot[grouping])
        }
      }
    },
    updateSet(updatedSetData: WorkoutSetSnapshotIn) {
      const setToUpdate = step.sets.find(set => {
        return set.guid === updatedSetData.guid
      })!

      const records = step.exerciseRecordsMap[setToUpdate.exercise.guid]!
      const isOldSetRecord = records.recordSetsMap.hasOwnProperty(
        setToUpdate.guid
      )
      const oldGroupingValue = setToUpdate!.groupingValue

      setToUpdate.mergeUpdate(updatedSetData)

      if (isOldSetRecord) {
        records.recalculateGroupingRecords(oldGroupingValue)
      }

      if (!isOldSetRecord || setToUpdate.groupingValue !== oldGroupingValue) {
        step.recordStore.runSetUpdatedCheck(setToUpdate)
      }
    },
    /** Made to work with drag and drop */
    reorderSets(from: number, to: number) {
      const item = step.sets[from]!

      const reorderedSets =
        getSnapshot(step.sets) // @ts-ignore
          .toSpliced(from, 1)
          .toSpliced(to, 0, item) ?? []

      step.setProp('sets', reorderedSets)
    },
  }))

export interface WorkoutStep extends Instance<typeof WorkoutStepModel> {}
export interface WorkoutStepSnapshotOut
  extends SnapshotOut<typeof WorkoutStepModel> {}
export interface WorkoutStepSnapshotIn
  extends SnapshotIn<typeof WorkoutStepModel> {}
