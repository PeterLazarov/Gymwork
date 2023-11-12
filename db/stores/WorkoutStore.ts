import { DateTime } from 'luxon'
import { IMSTArray, Instance, SnapshotOut, types } from 'mobx-state-tree'

import workoutSeedData from '../../data/workout-seed-data'
import { groupBy } from '../../utils/array'
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
    notesDialogOpen: false,
  })
  .views(store => ({
    get currentWorkout() {
      const [workout] = store.workouts.filter(
        w => w.date === store.currentWorkoutDate
      )
      return workout
    },
    get openedExercise() {
      const [opened] = this.currentWorkout.exercises.filter(
        e => e.guid === store.openedExerciseGuid
      )
      return opened
    },
    get exerciseHistory() {
      const keyedWorkouts = store.workouts.map(workout => ({
        ...workout,
        exerciseGuids: workout.exercises.map(
          exercise => exercise.exercise.guid
        ),
      }))
      // Grouped workouts by exercise
      const exerciseGroupedWorkouts = groupBy(keyedWorkouts, 'exerciseGuids')

      type SetHistory = {
        date: string
        sets: WorkoutSet[]
      }

      const exerciseHistory: Record<Exercise['guid'], SetHistory[]> = {}

      Object.keys(exerciseGroupedWorkouts).forEach(exerciseGuid => {
        const setsHistory = exerciseGroupedWorkouts[exerciseGuid].map(w => ({
          date: w.date,
          sets: w?.exercises
            .filter(e => e.exercise.guid === exerciseGuid)
            .flatMap(flat => flat.sets),
        }))
        // TODO: Fix TS
        exerciseHistory[exerciseGuid] = setsHistory
      })

      return exerciseHistory
    },
    get exerciseRecords() {
      type ExerciseHistory = Record<number, WorkoutSet>
      const result: Record<string, ExerciseHistory> = {}

      Object.keys(this.exerciseHistory).forEach(exerciseGuid => {
        const exerciseHistory = this.exerciseHistory[exerciseGuid]
        const records = exerciseHistory
          .flatMap(h => h.sets)
          .reduce(
            (acc, set) => {
              if (set.weight > (acc[set.reps]?.weight ?? -Infinity)) {
                acc[set.reps] = set
              }

              return acc
            },
            {} as Record<number, WorkoutSet>
          )

        const sortedRecords = Object.values(records)
          .sort((a, b) => a.reps - b.reps)
          .filter(({ weight }, i, arr) => {
            // Weight is more than the higher-rep sets
            return (
              i === arr.length - 1 ||
              !arr.slice(i + 1).some(set => set.weight >= weight) // !TODO optimize
            )
          })

        result[exerciseGuid] = sortedRecords
      })

      return result
    },
    get openedExerciseHistory() {
      return this.exerciseHistory[this.openedExercise.exercise.guid]
    },
    get openedExerciseRecords() {
      return this.exerciseRecords[this.openedExercise.exercise.guid]
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
    setWorkoutNotes(notes: string) {
      store.currentWorkout.notes = notes
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
