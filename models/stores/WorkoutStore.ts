import { DateTime } from 'luxon'
import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import workoutSeedData from '../../dbold/seeds/workout-seed-data.json'
import * as storage from '../../utils/storage'
import { Exercise } from '../Exercise'
import { WorkoutModel, WorkoutSnapshotIn } from '../Workout'
import { WorkoutExercise, WorkoutExerciseModel } from '../WorkoutExercise'
import { WorkoutSet, WorkoutSetModel } from '../WorkoutSet'
import { withSetPropAction } from '../helpers/withSetPropAction'

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
      const [currentWorkout] = store.workouts.filter(
        w => w.date === store.currentWorkoutDate
      )

      const [opened] = currentWorkout.exercises.filter(
        e => e.guid === store.openedExerciseGuid
      )
      return opened
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
      return created
    },
    addWorkoutExercise(exercise: Exercise) {
      const created = WorkoutExerciseModel.create({
        exercise: exercise.guid,
      })
      store.currentWorkout.exercises.push(created)

      return store.currentWorkout
    },
    setOpenedExercise(exercise: WorkoutExercise | null) {
      store.openedExerciseGuid = exercise?.guid || ''
    },
    addWorkoutExerciseSet(exerciseGuid: string, newSet: Partial<WorkoutSet>) {
      const created = WorkoutSetModel.create(newSet)

      store.openedExercise.sets.push(created)

      return store.openedExercise
    },
    removeWorkoutExerciseSet(exerciseGuid: string, setGuid: string) {
      // TODO: implement

      return store.openedExercise
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
