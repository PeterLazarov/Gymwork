import { DateTime } from 'luxon'
import {
  Instance,
  SnapshotOut,
  types,
  getParent,
  getSnapshot,
} from 'mobx-state-tree'

import { ExerciseStore } from './ExerciseStore'
import { RootStore } from './RootStore'
import { WorkoutStore } from './WorkoutStore'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Exercise, Workout, WorkoutSet, WorkoutSetModel } from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

// TODO: horiontal scrolling breaks BADLY (maybe) if the date goes outside of this range
const datePaddingCount = 365

export const StateStoreModel = types
  .model('StateStore')
  .props({
    openedExerciseGuid: '',
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
    get openedExercise(): Exercise | undefined {
      return this.exerciseStore.exercises.find(
        e => e.guid === self.openedExerciseGuid
      )
    },
    get openedWorkout(): Workout | undefined {
      return this.workoutStore.getWorkoutForDate(self.openedDate)
    },
    get isOpenedWorkoutToday() {
      return this.openedWorkout?.date === today.toISODate()!
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(this.workoutStore.exerciseWorkouts)
        .map(id => this.exerciseStore.exercises.find(e => e.guid === id))
        .filter(Boolean)
    },
    get openedExerciseSets(): WorkoutSet[] {
      const exerciseSets =
        this.openedWorkout?.sets.filter(
          e => e.exercise.guid === self.openedExerciseGuid
        ) ?? []

      return exerciseSets
    },
    get openedExerciseNextSet(): WorkoutSet {
      const lastSet = this.openedExerciseSets.at(-1)

      if (!lastSet)
        return WorkoutSetModel.create({
          exercise: self.openedExerciseGuid,
        })

      const { guid, ...rest } = getSnapshot(lastSet)
      return WorkoutSetModel.create(rest)
    },
    get openedExerciseSet(): WorkoutSet {
      const exerciseSets =
        this.openedWorkout?.sets.filter(
          e => e.exercise.guid === self.openedExerciseGuid
        ) ?? []

      return exerciseSets[exerciseSets.length - 1]
    },

    get openedExerciseWorkSets(): WorkoutSet[] {
      return this.openedExerciseSets.filter(s => !s.isWarmup)
    },

    get firstWorkout(): Workout {
      return this.workoutStore.workouts[this.workoutStore.workouts.length - 1]
    },

    get earliestDayVisible(): string {
      const from = (
        this.firstWorkout
          ? DateTime.fromISO(this.firstWorkout.date)
          : DateTime.now()
      ).minus({ day: datePaddingCount })

      return from.toISODate()!
    },

    get lastDayVisible(): string {
      return today.plus({ day: datePaddingCount }).toISODate()!
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    /** Made to work with drag and drop */
    reorderOpenedExerciseSets(from: number, to: number) {
      const indexFromAllSets = self.openedWorkout?.sets.indexOf(
        self.openedExerciseSets[from]
      )
      const indexToAllSets = self.openedWorkout?.sets.indexOf(
        self.openedExerciseSets[to]
      )

      if (!indexFromAllSets || !indexToAllSets) {
        console.warn('DnD issues?')
        return
      }

      const item = self.openedWorkout?.sets[indexFromAllSets]!
      const reorderedSets = self
        .openedWorkout!.sets.toSpliced(indexFromAllSets, 1)
        .toSpliced(indexToAllSets, 0, item)!

      // TODO check type
      // @ts-ignore
      self.openedWorkout!.setProp('sets', reorderedSets)
    },
    setOpenedExercise(exercise: Exercise | null) {
      self.openedExerciseGuid = exercise?.guid || ''
    },
    setOpenedDate(date: string) {
      self.openedDate = date
    },
    incrementCurrentDate() {
      const luxonDate = DateTime.fromISO(self.openedDate)
      self.openedDate = luxonDate.plus({ days: 1 }).toISODate()!
    },
    decrementCurrentDate() {
      const luxonDate = DateTime.fromISO(self.openedDate)
      self.openedDate = luxonDate.minus({ days: 1 }).toISODate()!
    },
  }))

export interface StateStore extends Instance<typeof StateStoreModel> {}
export interface StateStoreSnapshot
  extends SnapshotOut<typeof StateStoreModel> {}
