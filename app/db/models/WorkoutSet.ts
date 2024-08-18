import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { ExerciseModel, measurementDefaults } from './Exercise'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const WorkoutSetModel = types
  .model('WorkoutSet')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    isWarmup: false,

    reps: 0,

    weight: 0,
    weightUnit: measurementDefaults.weight.unit,

    distance: 0,
    distanceUnit: measurementDefaults.distance.unit,

    duration: 0,
    durationUnit: measurementDefaults.time.unit,
  })
  .views(set => ({
    // TODO redo?
    get measurementValue() {
      if (set.exercise.hasWeightMeasument) {
        return set.weight
      } else if (set.exercise.hasDistanceMeasument) {
        return set.distance
      } else if (set.exercise.hasTimeMeasument) {
        return set.duration // ! sometimes less is better!
      }

      return set.reps
    },
    get groupingValue() {
      switch (set.exercise.groupRecordsBy) {
        case 'time':
          return set.duration // TODO units?
        case 'reps':
          return set.reps
        case 'weight':
          return set.weight // TODO units?
        case 'distance':
          return set.distance // TODO units?

        default:
          return 0
      }
    },
  }))
  .actions(withSetPropAction)

export interface WorkoutSet extends Instance<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotOut
  extends SnapshotOut<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotIn
  extends SnapshotIn<typeof WorkoutSetModel> {}

export type WorkoutSetTrackData = Pick<
  WorkoutSet,
  | 'reps'
  | 'weight'
  | 'weightUnit'
  | 'distance'
  | 'distanceUnit'
  | 'duration'
  | 'durationUnit'
>
