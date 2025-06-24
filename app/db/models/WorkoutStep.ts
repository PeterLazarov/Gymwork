import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  getParentOfType,
  getSnapshot,
  types,
} from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction.ts'
import { RootStoreModel } from '../stores/RootStore.ts'
import { alphabeticNumbering } from '../../utils/string.ts'
import { getDataFieldForKey } from '../../utils/workoutRecordsCalculator.ts'

import { RecordStore } from '../stores/RecordStore.ts'

import { Exercise, ExerciseModel } from './Exercise.ts'
import { ExerciseRecord } from './ExerciseRecord.ts'
import {
  WorkoutSet,
  WorkoutSetModel,
  WorkoutSetSnapshotIn,
} from './WorkoutSet.ts'

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
      return step.exercises.reduce(
        (map, exercise) => {
          const records = this.recordStore.exerciseRecordsMap[exercise.guid]
          if (records) {
            map[exercise.guid] = records
          }
          return map
        },
        {} as Record<Exercise['guid'], ExerciseRecord>
      )
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
      return step.sets.reduce(
        (map, set) => {
          const mapSets = map[set.exercise.guid]
          if (mapSets) mapSets.push(set)
          else map[set.exercise.guid] = [set]

          return map
        },
        {} as Record<Exercise['guid'], WorkoutSet[]>
      )
    },
    get exerciseWorkSetsMap() {
      return step.sets.reduce(
        (map, set) => {
          if (!set.isWarmup) {
            const mapSets = map[set.exercise.guid]
            if (mapSets) mapSets.push(set)
            else map[set.exercise.guid] = [set]
          }
          return map
        },
        {} as Record<Exercise['guid'], WorkoutSet[]>
      )
    },
    get exerciseLettering(): Record<Exercise['guid'], string> {
      let map: Record<Exercise['guid'], string> = {}

      if (step.type === 'superSet') {
        map = step.exercises.reduce(
          (map, e, i) => {
            map[e.guid] = alphabeticNumbering(i)
            return map
          },
          {} as Record<Exercise['guid'], string>
        )
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
      if (newSet.completed) {
        step.recordStore.runSetUpdatedCheck(newSet)
      }
    },
    switchExercise(newVal: Exercise, oldVal: Exercise) {
      const newExercises = step.exercises
        .filter(ex => ex.guid !== oldVal.guid)
        .concat(newVal)

      this.removeAllSets()
      step.setProp('exercises', newExercises)
    },
    removeAllSets() {
      // TODO can be optimised
      step.sets.forEach(set => {
        this.removeSet(set.guid)
      })
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const deletedSetIndex = step.sets.findIndex(s => s.guid === setGuid)
      const deletedSet = step.sets[deletedSetIndex]
      if (deletedSet) {
        const { exercise } = deletedSet

        const records = step.exerciseRecordsMap[exercise.guid]
        const isRecordBool =
          records?.recordSetsMap.hasOwnProperty(deletedSet.guid) || false

        const deletedSetSnapshot = getSnapshot(deletedSet)
        step.sets.splice(deletedSetIndex, 1)

        if (isRecordBool && exercise.groupRecordsBy) {
          const grouping = getDataFieldForKey(exercise.groupRecordsBy)
          records?.recalculateGroupingRecords(deletedSetSnapshot[grouping])
        }
      }
    },
    updateSet(updatedSetData: WorkoutSetSnapshotIn) {
      const setToUpdate = step.sets.find(set => {
        return set.guid === updatedSetData.guid
      })
      if (!setToUpdate) return
      const oldGroupingValue = setToUpdate.groupingValue

      setToUpdate.mergeUpdate(updatedSetData)

      // Do not run set updated check if the set is not completed
      if (!setToUpdate.completed && !updatedSetData.completedAt) {
        return
      }

      const records = step.exerciseRecordsMap[setToUpdate.exercise.guid]
      if (!records) return

      const isOldSetRecord = records.recordSetsMap.hasOwnProperty(
        setToUpdate.guid
      )

      if (isOldSetRecord && oldGroupingValue) {
        records.recalculateGroupingRecords(oldGroupingValue)
      }

      if (!isOldSetRecord || setToUpdate.groupingValue !== oldGroupingValue) {
        step.recordStore.runSetUpdatedCheck(setToUpdate)
      }
    },
    /** Made to work with drag and drop */
    reorderSets(from: number, to: number) {
      const item = step.sets[from]
      if (!item || !step.sets[to]) return

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
