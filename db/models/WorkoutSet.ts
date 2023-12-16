import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { ExerciseModel } from './Exercise'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const WorkoutSetModel = types
  .model('WorkoutSet')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    weight: 0,
    reps: 0,
    distance: 0,
    distanceUnit: 'm',
    durationSecs: 0,
    isWarmup: false,
  })
  .views(set => ({
    get measurementValue() {
      if (set.exercise.hasWeightMeasument) {
        return set.weight
      } else if (set.exercise.hasDistanceMeasument) {
        return set.distance
      } else if (set.exercise.hasTimeMeasument) {
        return set.durationSecs
      }
      return set.reps
    },
    get groupingValue() {
      if (set.exercise.hasWeightMeasument) {
        return set.weight
      } else if (set.exercise.hasTimeGrouping) {
        return set.durationSecs
      }
      return set.reps
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
  'reps' | 'weight' | 'distance' | 'distanceUnit' | 'durationSecs'
>
