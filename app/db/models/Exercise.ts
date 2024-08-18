import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'

export const measurementDefaults = {
  time: {
    unit: 's',
    moreIsBetter: true,
  },
  reps: {
    moreIsBetter: true,
  },
  weight: {
    unit: 'kg',
    moreIsBetter: true,
  },
  distance: {
    unit: 'm',
    moreIsBetter: true,
  },
} as const

export const ExerciseMeasurementModel = types
  .model('ExerciseMeasurement')
  .props({
    time: types.maybe(
      types.model({
        unit: types.enumeration('timeUnit', ['ms', 's', 'm', 'h']),
        moreIsBetter: types.boolean,
      })
    ),
    reps: types.maybe(
      types.model({
        moreIsBetter: types.boolean,
      })
    ),
    weight: types.maybe(
      types.model({
        unit: types.enumeration('weightUnit', ['kg', 'lbs']),
        step: 2.5, // is this neccessary?
        moreIsBetter: types.boolean,
      })
    ),
    distance: types.maybe(
      types.model({
        unit: types.enumeration('distanceUnit', [
          'cm',
          'm',
          'km',
          'ft',
          'mile',
        ]),
        moreIsBetter: types.boolean,
      })
    ),
  })

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
        .map(([k]) => k)
    },
    get groupRecordsBy(): measurementName {
      // TODO extract out
      const groupByConfig: Array<{
        measurement: measurementName[]
        groupedBy: measurementName
      }> = [
        // TODO all types & logic
        { measurement: ['weight', 'reps'], groupedBy: 'reps' },
        { measurement: ['weight', 'time'], groupedBy: 'weight' },
        { measurement: ['weight', 'distance'], groupedBy: 'weight' },
        { measurement: ['weight'], groupedBy: 'weight' },
        { measurement: ['reps', 'distance'], groupedBy: 'reps' },
        { measurement: ['reps', 'time'], groupedBy: 'time' },
        { measurement: ['reps'], groupedBy: 'reps' },
        { measurement: ['time'], groupedBy: 'time' },
        { measurement: ['time', 'distance'], groupedBy: 'time' },
        { measurement: ['distance'], groupedBy: 'distance' },
      ]

      const exerciseMeasurementNames = this.measurementNames
      const groupByFallback = exerciseMeasurementNames[0]

      groupByConfig.find(cfg => {
        if (
          exerciseMeasurementNames.every(name => cfg.measurement.includes(name))
        ) {
          return cfg.groupedBy
        }
      })

      return groupByFallback
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
