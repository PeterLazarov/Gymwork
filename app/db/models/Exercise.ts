import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'
import DistanceType from 'app/enums/DistanceType'
import ExerciseType from 'app/enums/ExerciseType'

const REP_MEASUREMENTS = [
  ExerciseType.REPS_WEIGHT.value,
  ExerciseType.REPS_DISTANCE.value,
  ExerciseType.REPS_TIME.value,
  ExerciseType.REPS.value,
]
const REP_GROUPINGS = [
  ExerciseType.REPS.value,
  ExerciseType.REPS_WEIGHT.value,
  ExerciseType.REPS_DISTANCE.value,
]
const WEIGHT_MEASUREMENTS = [
  ExerciseType.REPS_WEIGHT.value,
  ExerciseType.WEIGHT_DISTANCE.value,
  ExerciseType.WEIGHT_TIME.value,
]
const WEIGHT_GROUPINGS = [
  ExerciseType.WEIGHT_DISTANCE.value,
  ExerciseType.WEIGHT_TIME.value,
]
const DISTANCE_MEASUREMENTS = [
  ExerciseType.TIME_DISTANCE.value,
  ExerciseType.REPS_DISTANCE.value,
  ExerciseType.WEIGHT_DISTANCE.value,
]
const TIME_MEASUREMENTS = [
  ExerciseType.TIME_DISTANCE.value,
  ExerciseType.REPS_TIME.value,
  ExerciseType.TIME.value,
  ExerciseType.WEIGHT_TIME.value,
]
const TIME_GROUPINGS = [ExerciseType.TIME_DISTANCE.value, ExerciseType.TIME.value]

export const ExerciseModel = types
  .model('Exercise')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: '',
    muscles: types.array(types.string),
    // measurementType: ExerciseType.REPS_WEIGHT,
    weightIncrement: 2.5,
    distanceUnit: DistanceType.M,
  })
  .views(exercise => ({
    get measurementType() {
      if (exercise.muscles.includes('cardio')) {
        return ExerciseType.TIME_DISTANCE.value
      }
      return ExerciseType.REPS_WEIGHT.value
    },
    get hasWeightMeasument() {
      return WEIGHT_MEASUREMENTS.includes(this.measurementType)
    },
    get hasWeightGrouping() {
      return WEIGHT_GROUPINGS.includes(this.measurementType)
    },
    get hasRepMeasument() {
      return REP_MEASUREMENTS.includes(this.measurementType)
    },
    get hasRepGrouping() {
      return REP_GROUPINGS.includes(this.measurementType)
    },
    get hasDistanceMeasument() {
      return DISTANCE_MEASUREMENTS.includes(this.measurementType)
    },
    get hasTimeMeasument() {
      return TIME_MEASUREMENTS.includes(this.measurementType)
    },
    get hasTimeGrouping() {
      return TIME_GROUPINGS.includes(this.measurementType)
    },
  }))
  .actions(withSetPropAction)

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut
  extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
