import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import { ExerciseStoreModel } from './ExerciseStore'
import { StateStoreModel } from './StateStore'
import { TimeStoreModel } from './TimeStore'
import { WorkoutStoreModel } from './WorkoutStore'
import { Exercise } from '../models'

export const RootStoreModel = types
  .model('RootStore')
  .props({
    exerciseStore: types.optional(ExerciseStoreModel, {}),
    workoutStore: types.optional(WorkoutStoreModel, {}),
    timeStore: types.optional(TimeStoreModel, {}),
    stateStore: types.optional(StateStoreModel, {}),
  })
  .views(self => ({
    get openedWorkoutExercises() {
      return self.stateStore.openedWorkout
        ? self.workoutStore.getWorkoutExercises(self.stateStore.openedWorkout)
        : []
    },
    get openedExercise(): Exercise | undefined {
      return self.exerciseStore.exercises.find(
        e => e.guid === self.stateStore.openedExerciseGuid
      )
    },
    get exercisesPerformed(): Exercise[] {
      return Object.keys(self.workoutStore.exerciseWorkouts)
        .map(id => self.exerciseStore.exercises.find(e => e.guid === id))
        .filter(Boolean)
    },
    // TODO: unused
    get openedExerciseHistory() {
      return self.workoutStore.exerciseHistory[
        self.stateStore.openedExerciseGuid
      ]
    },
    get openedExerciseRecords() {
      return self.workoutStore.getExerciseRecords(
        self.stateStore.openedExerciseGuid
      )
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
