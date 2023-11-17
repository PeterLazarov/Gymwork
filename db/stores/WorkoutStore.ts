import { DateTime } from 'luxon'
import {
  IMSTArray,
  Instance,
  SnapshotOut,
  types,
  destroy,
} from 'mobx-state-tree'

import workoutSeedData from '../../data/workout-seed-data'
import * as storage from '../../utils/storage'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
  WorkoutSet,
  WorkoutSetModel,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
  Workout,
  WorkoutSetSnapshotIn,
} from '../models'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
    openedDate: types.optional(types.string, today.toISODate()!), // TODO move out?
    openedExerciseGuid: '', // TODO move out?
  })
  .views(store => ({
    getWorkoutForDate(date: string): Workout | undefined {
      const [workout] = store.workouts.filter(w => w.date === date)
      return workout
    },
    // TODO to allow for multiple workouts per date?
    get openedWorkout(): Workout | undefined {
      return this.getWorkoutForDate(store.openedDate)
    },
    get isOpenedWorkoutToday() {
      return this.openedWorkout!.date === today.toISODate()!
    },
    getWorkoutExercises(workout: Workout) {
      const set = workout.sets.reduce(
        (acc, set) => acc.add(set.exercise),
        new Set<Exercise>()
      )
      return [...set]
    },
    get openedWorkoutExercises() {
      return this.openedWorkout
        ? this.getWorkoutExercises(this.openedWorkout)
        : []
    },

    get openedExerciseSets(): WorkoutSet[] {
      const exerciseSets =
        this.openedWorkout?.sets.filter(
          e => e.exercise.guid === store.openedExerciseGuid
        ) ?? []

      return exerciseSets
    },

    get openedExerciseWorkSets(): WorkoutSet[] {
      return this.openedExerciseSets.filter(s => !s.isWarmup)
    },

    get exerciseWorkouts(): Record<Exercise['guid'], Workout[]> {
      return store.workouts.reduce(
        (acc, workout) => {
          this.getWorkoutExercises(workout).forEach(exercise => {
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

    /** @returns all sets performed ever */
    get exerciseHistory(): Record<Exercise['guid'], WorkoutSet[]> {
      return Object.fromEntries(
        Object.entries(this.exerciseWorkouts).map(([exerciseID, workouts]) => {
          const sets: WorkoutSet[] = workouts.flatMap(w =>
            w.sets.filter(({ exercise }) => exercise.guid === exerciseID)
          )

          return [exerciseID, sets]
        })
      )
    },

    get allExerciseRecords(): Record<
      Exercise['guid'],
      Record<WorkoutSet['reps'], WorkoutSet>
    > {
      const records: Record<
        Exercise['guid'],
        Record<WorkoutSet['reps'], WorkoutSet>
      > = {}

      for (let i = 0; i < store.workouts.length; i++) {
        const workout = store.workouts[i]
        for (let j = 0; j < workout.sets.length; j++) {
          const set = workout.sets[j]

          if (!records[set.exercise.guid]) {
            records[set.exercise.guid] = {}
          }
          if (
            !records[set.exercise.guid][set.reps] ||
            records[set.exercise.guid][set.reps].weight < set.weight
          ) {
            records[set.exercise.guid][set.reps] = set
          }
        }
      }

      // Remove weak-ass records
      for (const exerciseID in records) {
        const exerciseRecords = records[exerciseID]
        const repRangeDescending = Object.keys(exerciseRecords).reverse()
        let lastRecord = exerciseRecords[repRangeDescending[0] as any as number]

        for (const reps of repRangeDescending) {
          const record = exerciseRecords[reps as any as number]
          if (lastRecord.weight >= record.weight) {
            delete exerciseRecords[reps as any as number]
          } else {
            lastRecord = record
          }
        }
      }

      return records
    },

    getExerciseRecords(
      exerciseID: Exercise['guid']
    ): Record<WorkoutSet['reps'], WorkoutSet> {
      return this.allExerciseRecords[exerciseID]
    },

    get openedExerciseHistory() {
      return this.exerciseHistory[store.openedExerciseGuid]
    },
    get openedExerciseRecords() {
      return this.getExerciseRecords(store.openedExerciseGuid)
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
      }, 1000) // TODO
    },
    async seed() {
      console.log('seeding')

      store.setProp('workouts', workoutSeedData)
    },
    createWorkout() {
      const created = WorkoutModel.create({
        date: store.openedDate,
      })
      store.workouts.push(created)
    },
    setOpenedExercise(exercise: Exercise | null) {
      store.openedExerciseGuid = exercise?.guid || ''
    },
    addSet(newSet: WorkoutSetSnapshotIn) {
      const created = WorkoutSetModel.create(newSet)

      store.openedWorkout?.sets.push(created)
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const set = store.openedWorkout?.sets.find(s => s.guid === setGuid)
      if (set) {
        destroy(set)
      }
    },
    updateWorkoutExerciseSet(updatedSet: WorkoutSet) {
      // TODO: fix typescript hackery
      const updated = store.openedWorkout?.sets.map(set =>
        set.guid === updatedSet.guid ? updatedSet : set
      )
      if (store.openedWorkout) {
        store.openedWorkout.sets = updated as unknown as IMSTArray<
          typeof WorkoutSetModel
        >
      }
    },
    incrementCurrentDate() {
      const luxonDate = DateTime.fromISO(store.openedDate)
      store.openedDate = luxonDate.plus({ days: 1 }).toISODate()!
    },
    decrementCurrentDate() {
      const luxonDate = DateTime.fromISO(store.openedDate)
      store.openedDate = luxonDate.minus({ days: 1 }).toISODate()!
    },
    setWorkoutNotes(notes: string) {
      if (store.openedWorkout) {
        store.openedWorkout.notes = notes
      }
    },
    setWorkoutSetWarmup(set: WorkoutSet, value: boolean) {
      set.isWarmup = value
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
