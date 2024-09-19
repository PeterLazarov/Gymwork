import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { ExerciseModel } from './Exercise'
import { withSetPropAction } from '../helpers/withSetPropAction'
import convert from 'convert-units'
import { withMergeUpdateAction } from '../helpers/withMergeUpdateAction'
import {
  isImperialDistance,
  measurementDefaults,
  measurementUnits,
} from './ExerciseMeasurement'

export const WorkoutSetModel = types
  .model('WorkoutSet')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    isWarmup: false,
    date: '',
    isWeakAssRecord: false,
    reps: 0,

    // The smallest unit that can convert to both metric and imperial without fractions is the microgram (μg)
    weightMcg: 0, // default is micrograms

    distanceMm: 0, // default is millimeters (micrometers would be better)

    // The smallest unit that works without fractions & is used widely - ms
    durationMs: 0, // default is ms

    restMs: 0,

    createdAt: types.optional(types.Date, () => Date.now()),
  })
  .views(set => ({
    // TODO redo?
    get measurementValue() {
      return set.weightMcg || set.durationMs || set.distanceMm
    },
    get groupingValue() {
      switch (set.exercise.groupRecordsBy) {
        case 'duration':
          return set.durationMs // TODO units?
        case 'reps':
          return set.reps
        case 'weight':
          return set.weightMcg // TODO units?
        case 'distance':
          return set.distanceMm // TODO units?

        default:
          return 0
      }
    },
    get weight() {
      if (!set.exercise.measurements.weight) return 0

      return Number(
        convert(set.weightMcg ?? 0)
          .from('mcg')
          .to(set.exercise.measurements.weight.unit)
          .toFixed(2)
      )
    },
    get distance() {
      if (!set.exercise.measurements.distance) return 0

      return Number(
        convert(set.distanceMm ?? 0)
          .from('mm')
          .to(set.exercise.measurements.distance.unit)
          .toFixed(2)
      )
    },
    get duration() {
      if (!set.exercise.measurements.duration) return 0

      return Number(
        convert(set.durationMs ?? 0)
          .from('ms')
          .to(set.exercise.measurements.duration.unit)
          .toFixed(2)
      )
    },
    get rest() {
      return Number(
        convert(set.restMs ?? 0)
          .from('ms')
          .to('s')
          .toFixed(2)
      )
    },
    get speed() {
      // TODO consider replacing 0 as default with undefined?
      if (
        !set.exercise.measurements.distance ||
        !set.exercise.measurements.duration
      )
        return 0

      const isImperial = isImperialDistance(
        set.exercise.measurements.distance.unit
      )
      const distanceUnit = isImperial
        ? measurementUnits.distance.mile
        : measurementUnits.distance.km

      const duration = convert(set.durationMs)
        .from(measurementUnits.duration.ms)
        .to(measurementUnits.duration.h)
      const distance = convert(set.distanceMm).from('mm').to(distanceUnit)
      return distance / duration
    },
  }))
  .actions(withSetPropAction)
  .actions(withMergeUpdateAction)
  .actions(self => ({
    setWeight(
      value: number,
      unit = self.exercise.measurements.weight?.unit ??
        measurementDefaults.weight.unit
    ) {
      self.setProp('weightMcg', convert(value).from(unit).to('mcg'))
    },
    setDistance(
      value: number,
      unit = self.exercise.measurements.distance?.unit ??
        measurementDefaults.distance.unit
    ) {
      self.setProp('distanceMm', convert(value).from(unit).to('mm'))
    },
    setDuration(
      value: number,
      unit = self.exercise.measurements.duration?.unit ??
        measurementDefaults.duration.unit
    ) {
      self.setProp('durationMs', convert(value).from(unit).to('ms'))
    },
    setRest(value: number, unit = 's' as const) {
      self.setProp('restMs', convert(value).from(unit).to('ms'))
    },
    isBetterThan(otherSet: WorkoutSet) {
      if (!self.exercise.measuredBy || !self.exercise.groupRecordsBy)
        return false

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
