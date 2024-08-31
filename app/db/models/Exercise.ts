import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'

// TODO? would this be better as an enum?
export const measurementUnits = {
  duration: {
    ms: 'ms',
    s: 's',
    m: 'm',
    h: 'h',
  },
  weight: {
    kg: 'kg',
    lb: 'lb',
  },
  distance: { cm: 'cm', m: 'm', km: 'km', ft: 'ft', mile: 'mi' },
  rest: {
    ms: 'ms',
    s: 's',
    m: 'm',
    h: 'h',
  },
  reps: {
    reps: 'reps',
  },
} as const

export type DistanceUnit = (typeof measurementUnits.distance)[keyof typeof measurementUnits.distance]
// Default units the exercise shows for input
// For example vertical jump distance could be feet
// Running could be meters
export const measurementDefaults = {
  duration: {
    unit: measurementUnits.duration.s,
    moreIsBetter: false,
  },
  reps: {
    unit: measurementUnits.reps.reps,
    moreIsBetter: true,
  },
  weight: {
    unit: measurementUnits.weight.kg,
    moreIsBetter: true,
    step: 2.5,
  },
  distance: {
    unit: measurementUnits.distance.m,
    moreIsBetter: true,
  },
  rest: {
    unit: measurementUnits.duration.s,
  },
}

export const measurementTypes = Object.keys(measurementDefaults).sort()

// Should we group by multiple?
const groupingCombinations: Array<{
  measurement: measurementName[]
  groupBy: measurementName
}> = [
  // { measurement: [], groupBy: '' },
  { measurement: ['weight'], groupBy: 'weight' },
  { measurement: ['duration'], groupBy: 'duration' },
  { measurement: ['duration', 'weight'], groupBy: 'weight' },
  { measurement: ['reps'], groupBy: 'reps' },
  { measurement: ['reps', 'weight'], groupBy: 'reps' },
  { measurement: ['reps', 'duration'], groupBy: 'duration' },
  { measurement: ['reps', 'duration', 'weight'], groupBy: 'duration' },
  { measurement: ['distance'], groupBy: 'distance' },
  { measurement: ['distance', 'weight'], groupBy: 'weight' },
  { measurement: ['distance', 'duration'], groupBy: 'distance' },
  { measurement: ['distance', 'duration', 'weight'], groupBy: 'duration' },
  { measurement: ['distance', 'reps'], groupBy: 'reps' },
  { measurement: ['distance', 'reps', 'weight'], groupBy: 'reps' },
  { measurement: ['distance', 'reps', 'duration'], groupBy: 'reps' },
  {
    measurement: ['distance', 'reps', 'duration', 'weight'],
    groupBy: 'reps',
  },
]

const measurementCombinations: Array<{
  measurement: measurementName[]
  measureBy: measurementName
}> = [
  // TODO: implement measureBy array for triple metrics ?
  { measurement: ['weight'], measureBy: 'weight' },
  { measurement: ['duration'], measureBy: 'duration' },
  { measurement: ['duration', 'weight'], measureBy: 'duration' },
  { measurement: ['reps'], measureBy: 'reps' },
  { measurement: ['reps', 'weight'], measureBy: 'weight' },
  { measurement: ['reps', 'duration'], measureBy: 'reps' },
  // { measurement: ['reps', 'duration', 'weight'], measureBy: 'duration' },
  { measurement: ['distance'], measureBy: 'distance' },
  { measurement: ['distance', 'weight'], measureBy: 'distance' },
  { measurement: ['distance', 'duration'], measureBy: 'duration' },
  // { measurement: ['distance', 'duration', 'weight'], measureBy: 'duration' },
  { measurement: ['distance', 'reps'], measureBy: 'distance' },
  // { measurement: ['distance', 'reps', 'weight'], measureBy: 'reps' },
  // { measurement: ['distance', 'reps', 'duration'], measureBy: 'reps' },
  // {
  //   measurement: ['distance', 'reps', 'duration', 'weight'],
  //   measureBy: 'reps',
  // },
]

export const ExerciseMeasurementModel = types
  .model('ExerciseMeasurement')
  .props({
    duration: types.maybe(
      types
        .model({
          unit: types.enumeration(
            'durationUnit',
            Object.values(measurementUnits.duration)
          ),
          moreIsBetter: types.boolean,
        })
        .actions(withSetPropAction)
    ),
    reps: types.maybe(
      types
        .model({
          unit: types.enumeration('reps', Object.values(measurementUnits.reps)),
          moreIsBetter: types.boolean,
        })
        .actions(withSetPropAction)
    ),
    weight: types.maybe(
      types
        .model({
          unit: types.enumeration(
            'weightUnit',
            Object.values(measurementUnits.weight)
          ),
          step: 2.5, // is this neccessary?
          moreIsBetter: types.boolean,
        })
        .actions(withSetPropAction)
    ),
    distance: types.maybe(
      types
        .model({
          unit: types.enumeration(
            'distanceUnit',
            Object.values(measurementUnits.distance)
          ),
          moreIsBetter: types.boolean,
        })
        .actions(withSetPropAction)
    ),
    rest: types.maybe(
      types
        .model({
          unit: types.enumeration(
            'restUnit',
            Object.values(measurementUnits.rest)
          ),
        })
        .actions(withSetPropAction)
    ),
  })
  .actions(withSetPropAction)

export interface ExerciseMeasurement
  extends Instance<typeof ExerciseMeasurementModel> {}
export interface ExerciseMeasurementSnapshotOut
  extends SnapshotOut<typeof ExerciseMeasurementModel> {}

export type FilterStrings<T> = T extends string ? T : never

type nonMetricFields = 'rest'
export type measurementName = Exclude<
  FilterStrings<keyof ExerciseMeasurementSnapshotOut>,
  nonMetricFields
>

export const ExerciseModel = types
  .model('Exercise')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: '',
    muscles: types.array(types.string),
    measurements: types.optional(ExerciseMeasurementModel, () => ({
      weight: measurementDefaults.weight,
      reps: measurementDefaults.reps,
    })),
    isFavorite: false,
  })
  .views(exercise => ({
    get hasWeightMeasument() {
      return !!exercise.measurements.weight
    },
    get hasWeightGrouping() {
      return this.hasWeightMeasument
    },
    get hasRepMeasument() {
      return !!exercise.measurements.reps
    },
    get measurementNames(): measurementName[] {
      return Object.entries(exercise.measurements)
        .filter(([k, v]) => v)
        .map(([k]) => k as measurementName)
    },
    get groupRecordsBy(): measurementName {
      const exerciseMeasurementNames = this.measurementNames
      const groupByFallback = exerciseMeasurementNames[0]

      const combination = groupingCombinations.find(cfg => {
        if (
          exerciseMeasurementNames
            // TODO grouping / measurement by rest
            .filter(m => m !== 'rest')
            .every(name => cfg.measurement.includes(name))
        ) {
          return cfg.groupBy
        }
        return null
      })

      return combination?.groupBy || groupByFallback
    },
    get measuredBy(): measurementName {
      const exerciseMeasurementNames = this.measurementNames
      const measureByFallback = exerciseMeasurementNames[0]

      const combination = measurementCombinations.find(cfg => {
        if (
          exerciseMeasurementNames
            // TODO grouping / measurement by rest
            .filter(m => m !== 'rest')
            .every(name => cfg.measurement.includes(name))
        ) {
          return cfg.measureBy
        }
        return null
      })

      return combination?.measureBy || measureByFallback
    },
    get groupMeasurement() {
      return exercise.measurements[this.groupRecordsBy]!
    },
    get valueMeasurement() {
      return exercise.measurements[this.measuredBy]!
    },
    get hasRepGrouping() {
      return this.groupRecordsBy === 'reps'
    },
    get hasDistanceMeasument() {
      return !!exercise.measurements.distance
    },
    get hasDistanceGrouping() {
      return this.groupRecordsBy === 'distance'
    },
    get hasTimeMeasument() {
      return !!exercise.measurements.duration
    },
    get hasTimeGrouping() {
      return this.groupRecordsBy === 'duration'
    },
  }))
  .actions(withSetPropAction)

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut
  extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
