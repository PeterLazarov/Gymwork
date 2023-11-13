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

function getWorkoutExercises(workout: Workout) {
  return workout.sets.reduce(
    (acc, set) => acc.add(set.exercise),
    new Set<Exercise>()
  )
}

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
    openedDate: types.optional(types.string, today.toISODate()!), // TODO move out?
    openedExerciseGuid: '', // TODO move out?
    notesDialogOpen: false, // TODO move out?
  })
  .views(store => ({
    // TODO to allow for multiple workouts per date?
    get currentWorkout(): Workout | undefined {
      const [workout] = store.workouts.filter(w => w.date === store.openedDate)
      return workout
    },

    get currentWorkoutExercises() {
      return this.currentWorkout
        ? [...getWorkoutExercises(this.currentWorkout)]
        : []
    },

    get currentWorkoutOpenedExerciseSets(): WorkoutSet[] {
      const exerciseSets =
        this.currentWorkout?.sets.filter(
          e => e.exercise.guid === store.openedExerciseGuid
        ) ?? []

      return exerciseSets.sort((s1, s2) => {
        return s1.isWarmup === s2.isWarmup ? 0 : s1.isWarmup ? -1 : 1
      })
    },

    get exerciseWorkouts(): Record<Exercise['guid'], Workout[]> {
      return store.workouts.reduce(
        (acc, workout) => {
          getWorkoutExercises(workout).forEach(exercise => {
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

      store.currentWorkout?.sets.push(created)
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const set = store.currentWorkout?.sets.find(s => s.guid === setGuid)
      if (set) {
        destroy(set)
      }
    },
    updateWorkoutExerciseSet(updatedSet: WorkoutSet) {
      // TODO: fix typescript hackery
      const updated = store.currentWorkout?.sets.map(set =>
        set.guid === updatedSet.guid ? updatedSet : set
      )
      if (store.currentWorkout) {
        store.currentWorkout.sets = updated as unknown as IMSTArray<
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
      if (store.currentWorkout) {
        store.currentWorkout.notes = notes
      }
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
