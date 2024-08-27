import {
  Instance,
  SnapshotOut,
  types,
  destroy,
  getParent,
  getSnapshot,
} from 'mobx-state-tree'

import { RootStore } from './RootStore'
import * as storage from 'app/utils/storage'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import workoutSeedData from 'app/db/seeds/workout-seed-data'
import {
  WorkoutSet,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
  Workout,
  WorkoutSetSnapshotIn,
} from 'app/db/models'
import { isDev } from 'app/utils/isDev'
import { getDataFieldForKey } from 'app/services/workoutRecordsCalculator'
import { WorkoutStepSnapshotIn } from '../models/WorkoutStep'

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
  })
  .views(store => ({
    get rootStore(): RootStore {
      return getParent(store) as RootStore
    },
    get dateWorkoutMap() {
      const map: Record<Workout['date'], Workout> = {}

      store.workouts.forEach(workout => {
        map[workout.date] = workout
      })
      return map
    },
    get exerciseWorkoutsMap(): Record<Exercise['guid'], Workout[]> {
      return store.workouts.reduce((acc, workout) => {
        workout.exercises.forEach(exercise => {
          if (!acc[exercise.guid]) {
            acc[exercise.guid] = []
          }
          acc[exercise.guid].push(workout)
        })

        return acc
      }, {} as Record<Exercise['guid'], Workout[]>)
    },

    /** @returns all sets performed ever */
    get exerciseHistory(): Record<Exercise['guid'], WorkoutSet[]> {
      return Object.fromEntries(
        Object.entries(this.exerciseWorkoutsMap).map(([exerciseID, workouts]) => {
          const sets = workouts.flatMap<WorkoutSet>(w => w.exerciseSetsMap[exerciseID])

          return [exerciseID, sets]
        })
      )
    },
    get mostUsedExercises(): Exercise[] {
      const sortedExercises = Object.values(this.exerciseHistory)
        .map((sets) => ({
          exercise: sets[0].exercise,
          count: sets.length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return sortedExercises.map(({ exercise }) => exercise)
    },

    get sortedWorkouts(): Workout[] {
      return store.workouts.slice().sort((a, b) => (a.date > b.date ? 1 : -1))
    },
    get firstWorkout(): Workout | undefined {
      console.log({ sorted: this.sortedWorkouts })
      return this.sortedWorkouts[0]
    },
    get lastWorkout(): Workout | undefined {
      return this.sortedWorkouts.at(-1)
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    async fetch() {
      const workouts = await storage.load<WorkoutSnapshotIn[]>('workouts')

      if (workouts && workouts?.length > 0 && isDev) {
        self.setProp('workouts', workouts)
      } else {
        await this.seed()
      }
    },
    async seed() {
      console.log('seeding workouts')

      self.setProp('workouts', workoutSeedData)
    },
    createWorkout() {
      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
      })
      self.workouts.push(created)
    },
    copyWorkout(template: Workout) {
      const getCleanedSets = (sets: WorkoutSet[]): WorkoutSetSnapshotIn[] => {
        return sets.map(
          ({ guid, exercise, ...otherProps }) => ({
            exercise: exercise.guid,
            ...otherProps,
          })
        )
      }

      const cleanedSteps: WorkoutStepSnapshotIn[] = template.steps.map(
        ({ guid, exercise, sets, ...otherProps }) => ({
          exercise: exercise.guid,
          sets: getCleanedSets(sets),
          ...otherProps,
        })
      )

      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        steps: cleanedSteps,
      })
      self.workouts.push(created)
    },
    addSet(newSet: WorkoutSet) {
      self.rootStore.stateStore.openedStep!.sets.push(newSet)
      self.rootStore.recordStore.runSetUpdatedCheck(newSet)
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const openedStep = self.rootStore.stateStore.openedStep!
      const deletedSetIndex = openedStep.sets.findIndex(
        s => s.guid === setGuid
      )
      const deletedSet = openedStep.sets[deletedSetIndex]
      if (deletedSet) {
        const { exercise } = deletedSet

        const records = self.rootStore.recordStore.getExerciseRecords(exercise.guid)
        const isRecordBool = records.recordSetsMap.hasOwnProperty(deletedSet.guid)

        const deletedSetSnapshot = getSnapshot(deletedSet)
        openedStep.sets.splice(deletedSetIndex, 1)

        if (isRecordBool) {
          const grouping = getDataFieldForKey(exercise.groupRecordsBy)
          self.rootStore.recordStore.recalculateGroupingRecordsForExercise(deletedSetSnapshot[grouping], records)
        }
      }
    },
    updateSet(updatedSetData: WorkoutSetSnapshotIn) {
      const setToUpdate = self.rootStore.stateStore.openedStep!.sets.find(set => {
        return set.guid === updatedSetData.guid
      })!

      const records = self.rootStore.recordStore.getExerciseRecords(setToUpdate!.exercise.guid)
      const isOldSetRecord = records.recordSetsMap.hasOwnProperty(setToUpdate.guid)
      const oldGroupingValue = setToUpdate!.groupingValue
      
      setToUpdate.mergeUpdate(updatedSetData)

      if (isOldSetRecord) {
        self.rootStore.recordStore.recalculateGroupingRecordsForExercise(oldGroupingValue, records)
      }

      if (!isOldSetRecord || setToUpdate.groupingValue !== oldGroupingValue) {
        self.rootStore.recordStore.runSetUpdatedCheck(setToUpdate)
      }
    },
    setWorkoutNotes(notes: string) {
      if (self.rootStore.stateStore.openedWorkout) {
        self.rootStore.stateStore.openedWorkout.notes = notes
      }
    },
    setWorkoutSetWarmup(set: WorkoutSet, value: boolean) {
      set.isWarmup = value
    },
    removeWorkout(workout: Workout) {
      destroy(workout)
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
