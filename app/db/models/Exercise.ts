import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'

// TODO? would this be better as an enum?
export const measurementUnits = {
  time: {
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
} as const

// Default units the exercise shows for input
// For example vertical jump distance could be feet
// Running could be meters
export const measurementDefaults = {
  time: {
    unit: measurementUnits.time.s,
    moreIsBetter: false,
  },
  reps: {
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
    unit: measurementUnits.time.s,
  },
}

export const measurementTypes = Object.keys(measurementDefaults)

// Should we group by multiple?
const groupingCombinations: Array<{
  measurement: measurementName[]
  groupBy: measurementName
}> = [
  // { measurement: [], groupBy: '' },
  { measurement: ['weight'], groupBy: 'weight' },
  { measurement: ['time'], groupBy: 'time' },
  { measurement: ['time', 'weight'], groupBy: 'weight' },
  { measurement: ['reps'], groupBy: 'reps' },
  { measurement: ['reps', 'weight'], groupBy: 'reps' },
  { measurement: ['reps', 'time'], groupBy: 'time' },
  { measurement: ['reps', 'time', 'weight'], groupBy: 'time' },
  { measurement: ['distance'], groupBy: 'distance' },
  { measurement: ['distance', 'weight'], groupBy: 'weight' },
  { measurement: ['distance', 'time'], groupBy: 'distance' },
  { measurement: ['distance', 'time', 'weight'], groupBy: 'time' },
  { measurement: ['distance', 'reps'], groupBy: 'reps' },
  { measurement: ['distance', 'reps', 'weight'], groupBy: 'reps' },
  { measurement: ['distance', 'reps', 'time'], groupBy: 'reps' },
  {
    measurement: ['distance', 'reps', 'time', 'weight'],
    groupBy: 'reps',
  },
]

const measurementCombinations: Array<{
  measurement: measurementName[]
  measureBy: measurementName
}> = [
  // TODO: implement measureBy array for triple metrics ?
  { measurement: ['weight'], measureBy: 'weight' },
  { measurement: ['time'], measureBy: 'time' },
  { measurement: ['time', 'weight'], measureBy: 'time' },
  { measurement: ['reps'], measureBy: 'reps' },
  { measurement: ['reps', 'weight'], measureBy: 'weight' },
  { measurement: ['reps', 'time'], measureBy: 'reps' },
  // { measurement: ['reps', 'time', 'weight'], measureBy: 'time' },
  { measurement: ['distance'], measureBy: 'distance' },
  { measurement: ['distance', 'weight'], measureBy: 'distance' },
  { measurement: ['distance', 'time'], measureBy: 'time' },
  // { measurement: ['distance', 'time', 'weight'], measureBy: 'time' },
  { measurement: ['distance', 'reps'], measureBy: 'distance' },
  // { measurement: ['distance', 'reps', 'weight'], measureBy: 'reps' },
  // { measurement: ['distance', 'reps', 'time'], measureBy: 'reps' },
  // {
  //   measurement: ['distance', 'reps', 'time', 'weight'],
  //   measureBy: 'reps',
  // },
]

export const ExerciseMeasurementModel = types
  .model('ExerciseMeasurement')
  .props({
    time: types.maybe(
      types
        .model({
          unit: types.enumeration(
            'timeUnit',
            Object.values(measurementUnits.time)
          ),
          moreIsBetter: types.boolean,
        })
        .actions(withSetPropAction)
    ),
    reps: types.maybe(
      types
        .model({
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

export type FilterStrings<T> = T extends string ? T : never

type nonMetricFields = 'rest'
export type measurementName = Exclude<
  FilterStrings<keyof SnapshotOut<typeof ExerciseMeasurementModel>>,
  nonMetricFields
>

export const ExerciseModel = types
  .model('Exercise')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: '',
    muscles: types.array(types.string),
    measurements: types.optional(ExerciseMeasurementModel, () => ({})),
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
          exerciseMeasurementNames.every(name => cfg.measurement.includes(name))
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
          exerciseMeasurementNames.every(name => cfg.measurement.includes(name))
        ) {
          return cfg.measureBy
        }
        return null
      })

      return combination?.measureBy || measureByFallback
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
      return !!exercise.measurements.time
    },
    get hasTimeGrouping() {
      return this.groupRecordsBy === 'time'
    },
  }))
  .actions(withSetPropAction)

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut
  extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
