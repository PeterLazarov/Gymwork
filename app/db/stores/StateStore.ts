import { DateTime } from 'luxon'
import { Instance, SnapshotOut, types, getParent } from 'mobx-state-tree'

import { ExerciseStore } from './ExerciseStore'
import { RootStore } from './RootStore'
import { WorkoutStore } from './WorkoutStore'
import { RecordStore } from './RecordStore'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { ExerciseRecord, Workout, WorkoutSetModel } from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

// TODO: horiontal scrolling breaks BADLY (maybe) if the date goes outside of this range
const datePaddingCount = 90

export const StateStoreModel = types
  .model('StateStore')
  .props({
    focusedStepGuid: '',
    highlightedSetGuid: '',
    feedbackUser: '',
    focusedExerciseGuid: types.maybe(types.string),
    openedDate: types.optional(types.string, today.toISODate()),
    draftSet: types.maybe(WorkoutSetModel),
    visitedWelcomeScreen: false,

    footerHeight: 0,
    chartWidth: 0,
    chartHeight: 0,
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
      const focusedStep = this.openedWorkout?.stepsMap[self.focusedStepGuid]
      return focusedStep
    },
    // ! TODO rethink
    get focusedExercise() {
      return (
        this.exerciseStore.exercisesMap[self.focusedExerciseGuid ?? ''] ||
        this.focusedStep?.exercise
      )
    },
    get openedWorkout(): Workout | undefined {
      return this.workoutStore.dateWorkoutMap[self.openedDate]
    },
    get focusedExerciseRecords(): ExerciseRecord | undefined {
      if (!this.focusedStep?.exercise) return

      return this.recordStore.exerciseRecordsMap[this.focusedStep.exercise.guid]
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
    initialize() {
      self.focusedStepGuid = ''
      self.highlightedSetGuid = ''
    },
    applySnapshot(snapshot: StateStoreSnapshot) {
      self.feedbackUser = snapshot?.feedbackUser
      self.visitedWelcomeScreen = snapshot?.visitedWelcomeScreen
    },
    setOpenedDate(date: string) {
      self.openedDate = date
      this.setFocusedStep('')
    },
    incrementCurrentDate() {
      const luxonDate = DateTime.fromISO(self.openedDate)
      self.openedDate = luxonDate.plus({ days: 1 }).toISODate()!
      this.setFocusedStep('')
    },
    decrementCurrentDate() {
      const luxonDate = DateTime.fromISO(self.openedDate)
      self.openedDate = luxonDate.minus({ days: 1 }).toISODate()!
      this.setFocusedStep('')
    },
    setFocusedStep(stepGuid: string) {
      self.focusedStepGuid = stepGuid
      self.highlightedSetGuid = ''

      const focusedStep = self.openedWorkout?.stepsMap[self.focusedStepGuid]
      self.focusedExerciseGuid = focusedStep?.exercises?.[0]?.guid
    },
    deleteFocusedStep(): () => void {
      if (self.openedWorkout && self.focusedStep) {
        const undoDelete = self.openedWorkout?.removeStep(self.focusedStep)
        this.setFocusedStep('')
        return undoDelete
      }

      return () => {}
    },
  }))

export interface StateStore extends Instance<typeof StateStoreModel> {}
export interface StateStoreSnapshot
  extends SnapshotOut<typeof StateStoreModel> {}
