import {
  Instance,
  SnapshotOut,
  types,
  destroy,
  getParent,
  getSnapshot,
} from 'mobx-state-tree'

import { RootStore } from './RootStore'
import * as storage from 'app/utils/storage'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import workoutSeedData from 'app/db/seeds/workout-seed-data'
import {
  WorkoutSet,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
  Workout,
  WorkoutSetSnapshotIn,
} from 'app/db/models'
import { isDev } from 'app/utils/isDev'
import { getGroupingRecordsForExercise, isCurrentRecord } from 'app/services/workoutRecordsCalculator'

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
  })
  .views(store => ({
    get rootStore(): RootStore {
      return getParent(store) as RootStore
    },
    get sortedWorkouts(): Workout[] {
      return store.workouts.slice().sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    },
    getWorkoutForDate(date: string): Workout | undefined {
      const [workout] = store.workouts.filter(w => w.date === date)
      return workout
    },
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
    addSet(newSet: WorkoutSet) {
      self.rootStore.stateStore.openedWorkout.sets.push(newSet)
      self.rootStore.recordStore.runSetUpdatedCheck(newSet)
    },
    removeSet(setGuid: WorkoutSet['guid']) {
      const deletedSet = self.rootStore.stateStore.openedWorkout.sets.find(
        s => s.guid === setGuid
      )
      if (deletedSet) {
        const { exercise } = deletedSet
        destroy(deletedSet)

        self.rootStore.recordStore.runSetGroupingRecordRefreshCheck(deletedSet, exercise)
      }
    },
    updateWorkoutExerciseSet(updatedSetData: WorkoutSet) {
      let oldSet: WorkoutSet;
      const updatedSets: WorkoutSet[] = [];
      
      self.rootStore.stateStore.openedWorkout.sets.forEach(set => {
        if (set.guid === updatedSetData.guid) {
          oldSet = set;
          updatedSets.push(updatedSetData);
        } else {
          updatedSets.push(set);
        }
      });
      const records = self.rootStore.recordStore.getExerciseRecords(oldSet!.exercise.guid)
      const isOldSetRecord = isCurrentRecord(records, oldSet!)
      const oldGroupingValue = oldSet!.groupingValue

      const updatedSetsSnapshots = updatedSets.map(set => getSnapshot(set))
      
      self.rootStore.stateStore.openedWorkout.setProp('sets', updatedSetsSnapshots)
      const updatedSet = self.rootStore.stateStore.openedWorkout.sets.find(set => set.guid === updatedSetData.guid)!

      if (isOldSetRecord) {
        const refreshedRecords = getGroupingRecordsForExercise(oldGroupingValue, records, self.sortedWorkouts)
        records.setProp('recordSets', refreshedRecords.recordSets)
      }

      if (!isOldSetRecord || updatedSet.groupingValue !== oldGroupingValue) {
        self.rootStore.recordStore.runSetUpdatedCheck(updatedSet)
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
    removeWorkout(workout: Workout) {
      destroy(workout)
    },
  }))

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
