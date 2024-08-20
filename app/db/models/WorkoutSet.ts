import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { ExerciseModel } from './Exercise'
import { withSetPropAction } from '../helpers/withSetPropAction'
import convert from 'convert-units'

export const WorkoutSetModel = types
  .model('WorkoutSet')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    exercise: types.reference(ExerciseModel),
    isWarmup: false,

    reps: 0,

    // The smallest unit that can convert to both metric and imperial without fractions is the microgram (μg)
    weightMcg: 0, // default is micrograms

    distanceMm: 0, // default is millimeters (micrometers would be better)

    // The smallest unit that works without fractions & is used widely - ms
    durationMs: 0, // default is ms
  })
  .views(set => ({
    // TODO redo?
    get measurementValue() {
      return set.weightMcg ?? set.distanceMm | set.durationMs
    },
    get groupingValue() {
      switch (set.exercise.groupRecordsBy) {
        case 'time':
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
      return Number(
        convert(set.weightMcg ?? 0)
          .from('mcg')
          .to(set.exercise.measurements.weight!.unit)
          .toFixed(2)
      )
    },
    get distance() {
      return Number(
        convert(set.distanceMm ?? 0)
          .from('mm')
          .to(set.exercise.measurements.distance!.unit)
          .toFixed(2)
      )
    },
    get duration() {
      return Number(
        convert(set.durationMs ?? 0)
          .from('ms')
          .to(set.exercise.measurements.time!.unit)
          .toFixed(2)
      )
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    setWeight(value: number, unit = self.exercise.measurements.weight?.unit!) {
      self.setProp('weightMcg', convert(value).from(unit).to('mcg'))
    },
    setDistance(
      value: number,
      unit = self.exercise.measurements.distance?.unit!
    ) {
      self.setProp('distanceMm', convert(value).from(unit).to('mm'))
    },
    setDuration(value: number, unit = self.exercise.measurements.time?.unit!) {
      self.setProp('durationMs', convert(value).from(unit).to('ms'))
    },
  }))

export interface WorkoutSet extends Instance<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotOut
  extends SnapshotOut<typeof WorkoutSetModel> {}
export interface WorkoutSetSnapshotIn
  extends SnapshotIn<typeof WorkoutSetModel> {}
