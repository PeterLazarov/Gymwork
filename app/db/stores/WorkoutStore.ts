import {
  IMSTArray,
  Instance,
  SnapshotOut,
  types,
  destroy,
  getParent,
} from 'mobx-state-tree'

import { RootStore } from './RootStore'
import workoutSeedData from '../seeds/workout-seed-data'
import * as storage from '../../../app/utils/storage'
import { withSetPropAction } from '../helpers/withSetPropAction'
import {
  WorkoutSet,
  WorkoutSetModel,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
  Workout,
  WorkoutSetSnapshotIn,
  WorkoutSetTrackData,
} from '../models'
import DistanceType from 'app/enums/DistanceType'
import { isDev } from 'app/utils/isDev'

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
      console.log('workoutStore',store.workouts.toJSON())
      console.log({date})
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

    get allExerciseRecords(): Record<
      Exercise['guid'],
      Record<WorkoutSet['groupingValue'], WorkoutSet>
    > {
      const records: Record<
        Exercise['guid'],
        Record<WorkoutSet['groupingValue'], WorkoutSet>
      > = {}

      for (let i = 0; i < store.workouts.length; i++) {
        const workout = store.workouts[i]
        for (let j = 0; j < workout.sets.length; j++) {
          const set = workout.sets[j]

          if (!records[set.exercise.guid]) {
            records[set.exercise.guid] = {}
          }

          const exerciseRecords = records[set.exercise.guid]
          const currentRecord = exerciseRecords[set.groupingValue]
          if (
            !currentRecord ||
            currentRecord.measurementValue < set.measurementValue
          ) {
            exerciseRecords[set.groupingValue] = set
          }
        }
      }

      // TODO: weak ass records breaks stuff for non rep-weight exercises
      for (const exerciseID in records) {
        const exerciseRecords = records[exerciseID]
        const groupingsDescending = Object.keys(exerciseRecords).reverse()
        let lastRecord =
          exerciseRecords[groupingsDescending[0] as any as number]
        for (const grouping of groupingsDescending) {
          const record = exerciseRecords[grouping as any as number]
          if (
            // not sure if higher value is always better
            lastRecord.measurementValue >= record.measurementValue &&
            lastRecord.guid !== record.guid
          ) {
            delete exerciseRecords[grouping as any as number]
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
        await this.seed()
      }
    },
    async seed() {
      // console.log('seeding workouts')

      // self.setProp('workouts', workoutSeedData)
    },
    createWorkout() {
      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
      })
      self.workouts.push(created)
    },
    copyWorkout(template: Workout) {
      const cleanedSets: WorkoutSetSnapshotIn[] = template.sets.map(({guid, exercise, ...otherProps}) => ({
        exercise: exercise.guid,
        ...otherProps
      }))

      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        sets: cleanedSets
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
        distance: 0,
        distanceUnit: DistanceType.M,
        durationSecs: 0,
      }
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
