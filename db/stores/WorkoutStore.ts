import { DateTime } from 'luxon'
import { IMSTArray, Instance, SnapshotOut, types } from 'mobx-state-tree'

import workoutSeedData from '../../dbold/seeds/workout-seed-data.json'
import * as storage from '../../utils/storage'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
  WorkoutExercise,
  WorkoutExerciseModel,
  WorkoutSet,
  WorkoutSetModel,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
} from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
    currentWorkoutDate: types.optional(types.string, today.toISODate()!),
    openedExerciseGuid: '',
  })
  .views(store => ({
    get currentWorkout() {
      const [workout] = store.workouts.filter(
        w => w.date === store.currentWorkoutDate
      )
      return workout
    },
    get openedExercise() {
      // TODO: use currentWorkout view instead?
      const [currentWorkout] = store.workouts.filter(
        w => w.date === store.currentWorkoutDate
      )

      const [opened] = currentWorkout.exercises.filter(
        e => e.guid === store.openedExerciseGuid
      )
      return opened
    },
    get openedExerciseHistory() {
      const includedWorkouts = store.workouts.filter(
        w =>
          w.exercises.filter(
            e => e.exercise.guid === this.openedExercise.exercise.guid
          ).length > 0
      )
      const setsHistory = includedWorkouts.map(w => ({
        date: w.date,
        sets: w.exercises
          .filter(e => e.exercise.guid === this.openedExercise.exercise.guid)
          .flatMap(flat => flat.sets),
      }))

      return setsHistory as {
        date: string
        sets: WorkoutSet[]
      }[]
    },
  }))
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      setTimeout(async () => {
        const workouts = await storage.load<WorkoutSnapshotIn[]>('workouts')
        console.log('fetching')

        if (workouts && workouts?.length > 0) {
          store.setProp('workouts', workouts)
        } else {
          await this.seed()
        }
      }, 1000)
    },
    async seed() {
      console.log('seeding')

      store.setProp('workouts', workoutSeedData)
    },
    createWorkout() {
      const created = WorkoutModel.create({
        date: store.currentWorkoutDate,
      })
      store.workouts.push(created)
    },
    addWorkoutExercise(exercise: Exercise) {
      const created = WorkoutExerciseModel.create({
        exercise: exercise.guid,
      })
      store.currentWorkout.exercises.push(created)
    },
    setOpenedExercise(exercise: WorkoutExercise | null) {
      store.openedExerciseGuid = exercise?.guid || ''
    },
    addWorkoutExerciseSet(newSet: Partial<WorkoutSet>) {
      const created = WorkoutSetModel.create(newSet)

      store.openedExercise.sets.push(created)
    },
    removeWorkoutExerciseSet(setGuid: string) {
      // TODO: fix typescript hackery
      const filtered = store.openedExercise.sets.filter(s => s.guid !== setGuid)
      store.openedExercise.sets = filtered as unknown as IMSTArray<
        typeof WorkoutSetModel
      >
    },
    updateWorkoutExerciseSet(updatedSet: WorkoutSet) {
      // TODO: fix typescript hackery
      const updated = store.openedExercise.sets.map(set =>
        set.guid === updatedSet.guid ? updatedSet : set
      )
      store.openedExercise.sets = updated as unknown as IMSTArray<
        typeof WorkoutSetModel
      >
    },
    incrementCurrentDate() {
      const luxonDate = DateTime.fromISO(store.currentWorkoutDate)
      store.currentWorkoutDate = luxonDate.plus({ days: 1 }).toISODate()!
    },
    decrementCurrentDate() {
      const luxonDate = DateTime.fromISO(store.currentWorkoutDate)
      store.currentWorkoutDate = luxonDate.minus({ days: 1 }).toISODate()!
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
