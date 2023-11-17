import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseStoreModel } from './ExerciseStore'
import { TimeStoreModel } from './TimeStore'
import { WorkoutStoreModel } from './WorkoutStore'
import { Exercise, WorkoutSet } from '../models'

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    timeStore: types.optional(TimeStoreModel, {}),
    openedExerciseGuid: '',
  })
  .views(self => ({
    get openedExercise(): Exercise | undefined {
      return self.exerciseStore.exercises.find(
        e => e.guid === self.openedExerciseGuid
      )
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(self.workoutStore.exerciseWorkouts)
        .map(id => self.exerciseStore.exercises.find(e => e.guid === id))
        .filter(Boolean)
    },
    get openedExerciseSets(): WorkoutSet[] {
      const exerciseSets =
        self.workoutStore.openedWorkout?.sets.filter(
          e => e.exercise.guid === self.openedExerciseGuid
        ) ?? []

      return exerciseSets
    },

    get openedExerciseWorkSets(): WorkoutSet[] {
      return this.openedExerciseSets.filter(s => !s.isWarmup)
    },
    // TODO: unused
    get openedExerciseHistory() {
      return self.workoutStore.exerciseHistory[self.openedExerciseGuid]
    },
    get openedExerciseRecords() {
      return self.workoutStore.getExerciseRecords(self.openedExerciseGuid)
    },
  }))
  .actions(self => ({
    setOpenedExercise(exercise: Exercise | null) {
      self.openedExerciseGuid = exercise?.guid || ''
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
