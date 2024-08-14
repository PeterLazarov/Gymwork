import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import DistanceType from "../../enums/DistanceType";
import ExerciseType from "../../enums/ExerciseType";
import { withSetPropAction } from "../helpers/withSetPropAction";

const REP_MEASUREMENTS = [
  ExerciseType.REPS_WEIGHT,
  ExerciseType.REPS_DISTANCE,
  ExerciseType.REPS_TIME,
  ExerciseType.REPS,
];
const REP_GROUPINGS = [
  ExerciseType.REPS,
  ExerciseType.REPS_WEIGHT,
  ExerciseType.REPS_DISTANCE,
];
const WEIGHT_MEASUREMENTS = [
  ExerciseType.REPS_WEIGHT,
  ExerciseType.WEIGHT_DISTANCE,
  ExerciseType.WEIGHT_TIME,
];
const WEIGHT_GROUPINGS = [
  ExerciseType.WEIGHT_DISTANCE,
  ExerciseType.WEIGHT_TIME,
];
const DISTANCE_MEASUREMENTS = [
  ExerciseType.TIME_DISTANCE,
  ExerciseType.REPS_DISTANCE,
  ExerciseType.WEIGHT_DISTANCE,
];
const TIME_MEASUREMENTS = [
  ExerciseType.TIME_DISTANCE,
  ExerciseType.REPS_TIME,
  ExerciseType.TIME,
  ExerciseType.WEIGHT_TIME,
];
const TIME_GROUPINGS = [ExerciseType.TIME_DISTANCE, ExerciseType.TIME];

export const ExerciseModel = types
  .model("Exercise")
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: "",
    muscles: types.array(types.string),
    // measurementType: ExerciseType.REPS_WEIGHT,
    weightIncrement: 2.5,
    distanceUnit: DistanceType.M,
  })
  .views((exercise) => ({
    get measurementType() {
      if (exercise.muscles.includes("cardio")) {
        return ExerciseType.TIME_DISTANCE;
      }
      return ExerciseType.REPS_WEIGHT;
    },
    get hasWeightMeasument() {
      return WEIGHT_MEASUREMENTS.includes(this.measurementType);
    },
    get hasWeightGrouping() {
      return WEIGHT_GROUPINGS.includes(this.measurementType);
    },
    get hasRepMeasument() {
      return REP_MEASUREMENTS.includes(this.measurementType);
    },
    get hasRepGrouping() {
      return REP_GROUPINGS.includes(this.measurementType);
    },
    get hasDistanceMeasument() {
      return DISTANCE_MEASUREMENTS.includes(this.measurementType);
    },
    get hasTimeMeasument() {
      return TIME_MEASUREMENTS.includes(this.measurementType);
    },
    get hasTimeGrouping() {
      return TIME_GROUPINGS.includes(this.measurementType);
    },
  }))
  .actions(withSetPropAction);

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut
  extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
