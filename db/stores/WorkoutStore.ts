import { DateTime } from 'luxon'
import { IMSTArray, Instance, SnapshotOut, types } from 'mobx-state-tree'

import workoutSeedData from '../../data/workout-seed-data'
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
  Workout,
} from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
    currentWorkoutDate: types.optional(types.string, today.toISODate()!),
    openedWorkoutExerciseGuid: '',
  })
  .views(store => ({
    get currentWorkout() {
      const [workout] = store.workouts.filter(
        w => w.date === store.currentWorkoutDate
      )
      return workout
    },
    get openedWorkoutExercise() {
      const [opened] = this.currentWorkout.exercises.filter(
        e => e.guid === store.openedWorkoutExerciseGuid
      )
      return opened
    },

    get exerciseWorkouts(): Record<Exercise['guid'], Workout[]> {
      return store.workouts.reduce(
        (acc, workout) => {
          workout.exercises.forEach(({ exercise }) => {
            if (!acc[exercise.guid]) {
              acc[exercise.guid] = []
            }
            acc[exercise.guid].push(workout)
          })

          return acc
        },
        {} as Record<Exercise['guid'], Workout[]>
      )
    },

    get exerciseHistory(): Record<Exercise['guid'], WorkoutSet[]> {
      return Object.fromEntries(
        Object.entries(this.exerciseWorkouts).map(([exerciseID, workouts]) => {
          const sets: WorkoutSet[] = workouts
            .map(w =>
              w.exercises
                .filter(({ exercise }) => exercise.guid === exerciseID)
                .flatMap(
                  workoutExercise => workoutExercise.sets as any as WorkoutSet
                )
            )
            .filter(Boolean)
            .flat()

          return [exerciseID, sets]
        })
      )
    },

    getExerciseRecords(
      exerciseID: Exercise['guid']
    ): Record<WorkoutSet['reps'], WorkoutSet> {
      const records = [...this.exerciseHistory[exerciseID]]
        .sort((a, b) => a.weight - b.weight)
        .filter(
          ({ reps }, i, arr) =>
            i === arr.length - 1 ||
            !arr.slice(i + 1).some(set => set.reps > reps)
        )

      return records.reduce(
        (acc, set) => {
          acc[set.reps] = set
          return acc
        },
        {} as Record<WorkoutSet['reps'], WorkoutSet>
      )
    },

    get openedExerciseHistory() {
      return this.exerciseHistory[this.openedWorkoutExercise.exercise.guid]
    },
    get openedExerciseRecords() {
      return this.getExerciseRecords(this.openedWorkoutExercise.exercise.guid)
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
    setOpenedWorkoutExercise(exercise: WorkoutExercise | null) {
      store.openedWorkoutExerciseGuid = exercise?.guid || ''
    },
    addWorkoutExerciseSet(newSet: Partial<WorkoutSet>) {
      const created = WorkoutSetModel.create(newSet)

      store.openedWorkoutExercise.sets.push(created)
    },
    removeWorkoutExerciseSet(setGuid: string) {
      // TODO: fix typescript hackery
      const filtered = store.openedWorkoutExercise.sets.filter(
        s => s.guid !== setGuid
      )
      store.openedWorkoutExercise.sets = filtered as unknown as IMSTArray<
        typeof WorkoutSetModel
      >
    },
    updateWorkoutExerciseSet(updatedSet: WorkoutSet) {
      // TODO: fix typescript hackery
      const updated = store.openedWorkoutExercise.sets.map(set =>
        set.guid === updatedSet.guid ? updatedSet : set
      )
      store.openedWorkoutExercise.sets = updated as unknown as IMSTArray<
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
