import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import ExerciseType from '../../enums/ExerciseType'
import { withSetPropAction } from '../helpers/withSetPropAction'

const REP_MEASUREMENTS = [
  ExerciseType.REPS_WEIGHT,
  ExerciseType.REPS_DISTANCE,
  ExerciseType.REPS_TIME,
  ExerciseType.REPS,
]
const WEIGHT_MEASUREMENTS = [
  ExerciseType.REPS_WEIGHT,
  ExerciseType.WEIGHT_DISTANCE,
  ExerciseType.WEIGHT_TIME,
]
const DISTANCE_MEASUREMENTS = [
  ExerciseType.TIME_DISTANCE,
  ExerciseType.REPS_DISTANCE,
]

export const ExerciseModel = types
  .model('Workout')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: '',
    muscles: types.array(types.string),
    measurementType: '',
    weightIncrement: 2.5,
  })
  .views(exercise => ({
    get hasWeightMeasument() {
      return WEIGHT_MEASUREMENTS.includes(exercise.measurementType)
    },
    get hasRepMeasument() {
      return REP_MEASUREMENTS.includes(exercise.measurementType)
    },
    get hasDistanceMeasument() {
      return DISTANCE_MEASUREMENTS.includes(exercise.measurementType)
    },
  }))
  .actions(withSetPropAction)

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut
  extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
