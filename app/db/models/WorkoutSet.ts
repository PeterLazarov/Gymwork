import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { ExerciseModel } from './Exercise'
import { withSetPropAction } from '../helpers/withSetPropAction'
import convert from 'convert-units'
import { withMergeUpdateAction } from '../helpers/withMergeUpdateAction'
import { measurementDefaults, measurementUnits } from './ExerciseMeasurement'

export const WorkoutSetModel = types
  .model('WorkoutSet')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    isWarmup: false,
    date: '',
    isWeakAssRecord: false,
    reps: types.maybe(types.number),

    // The smallest unit that can convert to both metric and imperial without fractions is the microgram (μg)
    weightMcg: types.maybe(types.number), // default is micrograms

    distanceMm: types.maybe(types.number), // default is millimeters (micrometers would be better)

    // The smallest unit that works without fractions & is used widely - ms
    durationMs: types.maybe(types.number), // default is ms

    speedKph: types.maybe(types.number),

    restMs: types.maybe(types.number),

    createdAt: types.optional(types.Date, () => Date.now()),

    completed: true,
  })
  .views(set => ({
    get measurementValue() {
      switch (set.exercise.measuredBy) {
        case 'duration':
          return set.durationMs
        case 'reps':
          return set.reps
        case 'weight':
          return set.weightMcg
        case 'distance':
          return set.distanceMm

        default:
          return 0
      }
    },
    get groupingValue() {
      switch (set.exercise.groupRecordsBy) {
        case 'duration':
          return set.durationMs
        case 'reps':
          return set.reps
        case 'weight':
          return set.weightMcg
        case 'distance':
          return set.distanceMm

        default:
          return 0
      }
    },
    get weight() {
      if (set.exercise.measurements.weight === undefined) return undefined

      return Number(
        convert(set.weightMcg ?? 0)
          .from('mcg')
          .to(set.exercise.measurements.weight.unit)
          .toFixed(2)
      )
    },
    get distance() {
      if (set.exercise.measurements.distance === undefined) return undefined

      if (set.distanceMm) {
        return Number(
          convert(set.distanceMm)
            .from('mm')
            .to(set.exercise.measurements.distance.unit)
            .toFixed(2)
        )
      }
    },
    get inferredDistance() {
      if (set.exercise.measurements.distance === undefined) return undefined

      if (set.durationMs && set.speedKph) {
        return convert(
          convert(set.durationMs).from('ms').to('h') * set.speedKph
        )
          .from('km')
          .to(set.exercise.measurements.distance.unit)
      }
    },
    get duration() {
      if (set.exercise.measurements.duration === undefined) return undefined

      if (set.durationMs) {
        return Number(
          convert(set.durationMs)
            .from('ms')
            .to(set.exercise.measurements.duration.unit)
            .toFixed(2)
        )
      }
    },
    get inferredDuration() {
      if (set.exercise.measurements.duration === undefined) return undefined

      if (set.distanceMm && set.speedKph)
        return convert(
          convert(set.distanceMm).from('mm').to('km') / set.speedKph
        )
          .from('h')
          .to(set.exercise.measurements.duration.unit)
    },
    get rest() {
      if (set.restMs === undefined) return undefined

      return Number(
        convert(set.restMs ?? 0)
          .from('ms')
          .to('s')
          .toFixed(2)
      )
    },
    get speed() {
      if (set.speedKph !== undefined && set.exercise.measurements.speed)
        return convert(set.speedKph)
          .from('km/h')
          .to(set.exercise.measurements.speed.unit)
    },
    get inferredSpeed() {
      if (
        !set.exercise.measurements.speed ||
        !set.exercise.measurements.distance ||
        !set.exercise.measurements.duration ||
        !set.durationMs ||
        !set.distanceMm
      )
        return undefined

      const duration = convert(set.durationMs)
        .from(measurementUnits.duration.ms)
        .to(measurementUnits.duration.h)

      const distance = convert(set.distanceMm).from('mm').to('km')

      return convert(distance / duration)
        .from('km/h')
        .to(set.exercise.measurements.speed.unit)
    },
  }))
  .actions(withSetPropAction)
  .actions(withMergeUpdateAction)
  .actions(self => ({
    setWeight(
      value: number | undefined,
      unit = self.exercise.measurements.weight?.unit ??
        measurementDefaults.weight.unit
    ) {
      self.setProp(
        'weightMcg',
        value === undefined ? undefined : convert(value).from(unit).to('mcg')
      )
    },
    setDistance(
      value: number | undefined,
      unit = self.exercise.measurements.distance?.unit ??
        measurementDefaults.distance.unit
    ) {
      self.setProp(
        'distanceMm',
        value === undefined ? undefined : convert(value).from(unit).to('mm')
      )
    },
    setDuration(
      value: number | undefined,
      unit = self.exercise.measurements.duration?.unit ??
        measurementDefaults.duration.unit
    ) {
      self.setProp(
        'durationMs',
        value === undefined ? undefined : convert(value).from(unit).to('ms')
      )
    },
    setRest(
      value: number | undefined,
      unit: keyof (typeof measurementUnits)['rest'] = 's' as const
    ) {
      self.setProp(
        'restMs',
        value === undefined ? undefined : convert(value).from(unit).to('ms')
      )
    },
    // TODO add setSpeed?
    isBetterThan(otherSet: WorkoutSet) {
      if (!self.exercise.measuredBy || !self.exercise.groupRecordsBy)
        return false

      if (
        self.measurementValue === undefined ||
        self.groupingValue === undefined
      ) {
        return false
      }

      if (
        otherSet.measurementValue === undefined ||
        otherSet.groupingValue === undefined
      ) {
        return true
      }

      const isMoreBetter =
        self.exercise.measurements[self.exercise.measuredBy].moreIsBetter
      const groupingIsMoreBetter =
        self.exercise.measurements[self.exercise.groupRecordsBy].moreIsBetter

      const isTied = self.measurementValue === otherSet.measurementValue

      const measurementDiff = self.measurementValue - otherSet.measurementValue
      const groupingDiff = self.groupingValue - otherSet.groupingValue

      const tieBreak = groupingIsMoreBetter
        ? groupingDiff > 0
        : groupingDiff < 0
      const isMeasurementMore = isMoreBetter
        ? measurementDiff > 0
        : measurementDiff < 0

      return isMeasurementMore || (isTied && tieBreak)
    },
  }))

export interface WorkoutSet extends Instance<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotOut
  extends SnapshotOut<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotIn
  extends SnapshotIn<typeof WorkoutSetModel> {}
