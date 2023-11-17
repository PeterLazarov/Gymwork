import { DateTime } from 'luxon'
import { Instance, SnapshotOut, types, getParent } from 'mobx-state-tree'

import { RootStore } from './RootStore'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Exercise, Workout, WorkoutSet } from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const StateStoreModel = types
  .model('StateStore')
  .props({
    openedExerciseGuid: '',
    openedDate: types.optional(types.string, today.toISODate()!),
  })
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self) as RootStore
    },
    // TODO to allow for multiple workouts per date?
    get openedWorkout(): Workout | undefined {
      return this.rootStore.workoutStore.getWorkoutForDate(self.openedDate)
    },
    get isOpenedWorkoutToday() {
      return this.openedWorkout?.date === today.toISODate()!
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(this.rootStore.workoutStore.exerciseWorkouts)
        .map(id =>
          this.rootStore.exerciseStore.exercises.find(e => e.guid === id)
        )
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
  }))
  .actions(withSetPropAction)
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

export interface StateStore extends Instance<typeof StateStoreModel> {}
export interface StateStoreSnapshot
  extends SnapshotOut<typeof StateStoreModel> {}
