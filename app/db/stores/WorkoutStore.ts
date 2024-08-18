import {
  IMSTArray,
  Instance,
  SnapshotOut,
  types,
  destroy,
  getParent,
} from 'mobx-state-tree'

import { RootStore } from './RootStore'
import * as storage from 'app/utils/storage'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import workoutSeedData from 'app/db/seeds/workout-seed-data'
import {
  WorkoutSet,
  WorkoutSetModel,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
  Workout,
  WorkoutSetSnapshotIn,
  WorkoutSetTrackData,
  measurementUnits,
  measurementDefaults,
} from 'app/db/models'
import { isDev } from 'app/utils/isDev'
import {
  ExerciseRecord,
  calculateRecords,
} from 'app/services/workoutRecordsCalculator'

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
  })
  .views(store => ({
    get rootStore(): RootStore {
      return getParent(store) as RootStore
    },
    getWorkoutForDate(date: string): Workout | undefined {
      const [workout] = store.workouts.filter(w => w.date === date)
      return workout
    },
    // TODO to allow for multiple workouts per date?
    getWorkoutExercises(workout: Workout): Exercise[] {
      return workout.exercises
    },

    get exerciseWorkouts(): Record<Exercise['guid'], Workout[]> {
      return store.workouts.reduce((acc, workout) => {
        this.getWorkoutExercises(workout).forEach(exercise => {
          if (!acc[exercise.guid]) {
            acc[exercise.guid] = []
          }
          acc[exercise.guid].push(workout)
        })

        return acc
      }, {} as Record<Exercise['guid'], Workout[]>)
    },

    // TODO: not used anywhere
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
    get mostUsedExercises(): Exercise[] {
      const sortedExercises = Object.entries(this.exerciseHistory)
        .map(([exerciseId, sets]) => ({
          exercise: sets[0].exercise,
          count: sets.length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return sortedExercises.map(({ exercise }) => exercise)
    },

    get allExerciseRecords(): Record<Exercise['guid'], ExerciseRecord> {
      return calculateRecords(store.workouts)
    },

    getExerciseRecords(
      exerciseID: Exercise['guid']
    ): Record<WorkoutSet['reps'], WorkoutSet> {
      return this.allExerciseRecords[exerciseID] ?? {}
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    async fetch() {
      const workouts = await storage.load<WorkoutSnapshotIn[]>('workouts')

      if (workouts && workouts?.length > 0 && isDev) {
        self.setProp('workouts', workouts)
      } else {
        // await this.seed()
      }
    },
    async seed() {
      console.log('seeding workouts')

      self.setProp('workouts', workoutSeedData)
    },
    createWorkout() {
      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
      })
      self.workouts.push(created)
    },
    copyWorkout(template: Workout) {
      const cleanedSets: WorkoutSetSnapshotIn[] = template.sets.map(
        ({ guid, exercise, ...otherProps }) => ({
          exercise: exercise.guid,
          ...otherProps,
        })
      )

      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        sets: cleanedSets,
      })
      self.workouts.push(created)
    },
    addSet(newSet: WorkoutSetSnapshotIn) {
      const created = WorkoutSetModel.create(newSet)

      self.rootStore.stateStore.openedWorkout?.sets.push(created)
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const set = self.rootStore.stateStore.openedWorkout?.sets.find(
        s => s.guid === setGuid
      )
      if (set) {
        destroy(set)
      }
    },
    updateWorkoutExerciseSet(updatedSet: WorkoutSet) {
      // TODO: fix typescript hackery
      const updated = self.rootStore.stateStore.openedWorkout?.sets.map(set =>
        set.guid === updatedSet.guid ? updatedSet : set
      )
      if (self.rootStore.stateStore.openedWorkout) {
        self.rootStore.stateStore.openedWorkout.sets =
          updated as unknown as IMSTArray<typeof WorkoutSetModel>
      }
    },
    setWorkoutNotes(notes: string) {
      if (self.rootStore.stateStore.openedWorkout) {
        self.rootStore.stateStore.openedWorkout.notes = notes
      }
    },
    setWorkoutSetWarmup(set: WorkoutSet, value: boolean) {
      set.isWarmup = value
    },
    getEmptySet(): WorkoutSetTrackData {
      return {
        reps: 0,
        weight: 0,
        weightUnit: measurementDefaults.weight.unit,
        distance: 0,
        distanceUnit: measurementDefaults.distance.unit,
        duration: 0,
        durationUnit: measurementDefaults.time.unit,
      }
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
