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
    moreIsBetter: true,
  },
  reps: {
    moreIsBetter: true,
  },
  weight: {
    unit: measurementUnits.weight.kg,
    moreIsBetter: true,
  },
  distance: {
    unit: measurementUnits.distance.m,
    moreIsBetter: true,
  },
  rest: {
    unit: measurementUnits.time.s,
    minAutorecordDurationSeconds: 30,
  },
}

export const measurementTypes = Object.keys(measurementDefaults)

// Should we group by multiple?
const groupingDefaults: Array<{
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
          minAutorecordDurationSeconds: types.number,
        })
        .actions(withSetPropAction)
    ),
  })
  .actions(withSetPropAction)

export type FilterStrings<T> = T extends string ? T : never
export type measurementName = FilterStrings<
  keyof SnapshotOut<typeof ExerciseMeasurementModel>
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

      const grouping = groupingDefaults.find(cfg => {
        if (
          exerciseMeasurementNames.every(name => cfg.measurement.includes(name))
        ) {
          return cfg.groupBy
        }
        return null
      })

      return grouping?.groupBy || groupByFallback
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
