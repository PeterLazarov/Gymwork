import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'

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

export type DistanceUnit =
  (typeof measurementUnits.distance)[keyof typeof measurementUnits.distance]
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
