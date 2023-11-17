import { DateTime } from 'luxon'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseStoreModel } from './ExerciseStore'
import { TimeStoreModel } from './TimeStore'
import { WorkoutStoreModel } from './WorkoutStore'
import { Exercise, Workout, WorkoutSet } from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    timeStore: types.optional(TimeStoreModel, {}),
    openedExerciseGuid: '',
    openedDate: types.optional(types.string, today.toISODate()!),
  })
  .views(self => ({
    // TODO to allow for multiple workouts per date?
    get openedWorkout(): Workout | undefined {
      return self.workoutStore.getWorkoutForDate(self.openedDate)
    },
    get isOpenedWorkoutToday() {
      return this.openedWorkout?.date === today.toISODate()!
    },
    get openedWorkoutExercises() {
      return this.openedWorkout
        ? self.workoutStore.getWorkoutExercises(this.openedWorkout)
        : []
    },
    get openedExercise(): Exercise | undefined {
      return self.exerciseStore.exercises.find(
        e => e.guid === self.openedExerciseGuid
      )
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(self.workoutStore.exerciseWorkouts)
        .map(id => self.exerciseStore.exercises.find(e => e.guid === id))
        .filter(Boolean)
    },
    get openedExerciseSets(): WorkoutSet[] {
      const exerciseSets =
        this.openedWorkout?.sets.filter(
          e => e.exercise.guid === self.openedExerciseGuid
        ) ?? []

      return exerciseSets
    },

    get openedExerciseWorkSets(): WorkoutSet[] {
      return this.openedExerciseSets.filter(s => !s.isWarmup)
    },
    // TODO: unused
    get openedExerciseHistory() {
      return self.workoutStore.exerciseHistory[self.openedExerciseGuid]
    },
    get openedExerciseRecords() {
      return self.workoutStore.getExerciseRecords(self.openedExerciseGuid)
    },
  }))
  .actions(self => ({
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

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
