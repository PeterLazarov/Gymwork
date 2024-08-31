import { DateTime } from 'luxon'
import { Instance, SnapshotOut, types, getParent } from 'mobx-state-tree'

import { ExerciseStore } from './ExerciseStore'
import { RootStore } from './RootStore'
import { WorkoutStore } from './WorkoutStore'
import { RecordStore } from './RecordStore'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
  Exercise,
  ExerciseRecord,
  Workout,
  WorkoutSet,
  WorkoutSetModel,
} from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

// TODO: horiontal scrolling breaks BADLY (maybe) if the date goes outside of this range
const datePaddingCount = 90

export const StateStoreModel = types
  .model('StateStore')
  .props({
    focusedStepGuid: '',
    focusedSetGuid: '',
    openedDate: types.optional(types.string, today.toISODate()!),
    draftSet: types.maybe(WorkoutSetModel),
  })
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self) as RootStore
    },
    get exerciseStore(): ExerciseStore {
      return this.rootStore.exerciseStore
    },
    get workoutStore(): WorkoutStore {
      return this.rootStore.workoutStore
    },
    get recordStore(): RecordStore {
      return this.rootStore.recordStore
    },
    get focusedStep() {
      return this.openedWorkout?.stepsMap[self.focusedStepGuid]
    },
    get openedWorkout(): Workout | undefined {
      return this.workoutStore.dateWorkoutMap[self.openedDate]
    },
    get isOpenedWorkoutToday() {
      return this.openedWorkout?.date === today.toISODate()
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(this.workoutStore.exerciseWorkoutsHistoryMap)
        .map(id => this.exerciseStore.exercisesMap[id])
        .filter(Boolean)
    },
    get focusedStepSets(): WorkoutSet[] {
      const exerciseSets = this.focusedStep!.sets

      return exerciseSets
    },
    get focusedStepLastSet(): WorkoutSet | undefined {
      return this.focusedStepSets.at(-1)
    },
    get focusedExerciseRecords(): ExerciseRecord {
      return this.recordStore.getExerciseRecords(
        this.focusedStep!.exercise.guid
      )
    },
    get focusedStepWorkSets(): WorkoutSet[] {
      return this.focusedStepSets.filter(s => !s.isWarmup)
    },

    get firstWorkout(): Workout | undefined {
      return this.workoutStore.workouts[this.workoutStore.workouts.length - 1]
    },

    get firstRenderedDate(): string {
      const from = (
        this.firstWorkout
          ? DateTime.fromISO(this.firstWorkout.date)
          : DateTime.now()
      ).minus({ day: datePaddingCount })

      return from.toISODate()!
    },

    get lastRenderedDate(): string {
      const nowISO = new Date().toISOString()
      const lastWorkoutDate = this.workoutStore.lastWorkout?.date
      const lastWorkoutOrToday =
        lastWorkoutDate && lastWorkoutDate > nowISO ? lastWorkoutDate : nowISO
      return DateTime.fromISO(lastWorkoutOrToday)
        .plus({ day: datePaddingCount })
        .toISODate()!
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    setOpenedDate(date: string) {
      self.openedDate = date
      self.setProp('focusedStepGuid', '')
      self.setProp('focusedSetGuid', '')
    },
    incrementCurrentDate() {
      const luxonDate = DateTime.fromISO(self.openedDate)
      self.openedDate = luxonDate.plus({ days: 1 }).toISODate()!
      self.setProp('focusedStepGuid', '')
    },
    decrementCurrentDate() {
      const luxonDate = DateTime.fromISO(self.openedDate)
      self.openedDate = luxonDate.minus({ days: 1 }).toISODate()!
      self.setProp('focusedStepGuid', '')
    },
  }))

export interface StateStore extends Instance<typeof StateStoreModel> {}
export interface StateStoreSnapshot
  extends SnapshotOut<typeof StateStoreModel> {}
