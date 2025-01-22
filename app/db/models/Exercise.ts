import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction'

import {
  ExerciseMeasurementModel,
  measurementDefaults,
  measurementName,
} from './ExerciseMeasurement'

// Should we group by multiple?
const groupingCombinations: {
  measurement: measurementName[]
  groupBy: measurementName
}[] = [
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
  { measurement: ['distance', 'duration', 'speed'], groupBy: 'distance' },
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

const measurementCombinations: {
  measurement: measurementName[]
  measureBy: measurementName
}[] = [
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
  { measurement: ['distance', 'duration', 'speed'], measureBy: 'duration' },
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

export const ExerciseModel = types
  .model('Exercise')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    name: types.string,
    images: types.array(types.string),
    equipment: types.array(types.string),
    position: types.maybe(types.string),
    stance: types.maybe(types.string),
    instructions: types.array(types.string),
    tips: types.maybe(types.array(types.string)),
    muscleAreas: types.array(types.string),

    muscles: types.array(types.string),
    measurements: types.optional(ExerciseMeasurementModel, () => ({
      weight: measurementDefaults.weight,
      reps: measurementDefaults.reps,
    })),
    isFavorite: false,
  })
  .views(exercise => ({
    get measurementNames(): measurementName[] {
      return Object.entries(exercise.measurements)
        .filter(([, v]) => v)
        .map(([k]) => k as measurementName)
    },
    get groupRecordsBy(): measurementName | undefined {
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
    get measuredBy(): measurementName | undefined {
      const exerciseMeasurementNames = this.measurementNames
      const measureByFallback = exerciseMeasurementNames[0]

      const combination = measurementCombinations.find(cfg => {
        if (
          cfg.measurement.every(name => exerciseMeasurementNames.includes(name))
        ) {
          return cfg.measureBy
        }
        return null
      })

      return combination?.measureBy || measureByFallback
    },
    // TODO fix type
    get groupMeasurement() {
      return this.groupRecordsBy
        ? exercise.measurements[this.groupRecordsBy]
        : undefined
    },
    // TODO fix type
    get valueMeasurement() {
      return this.measuredBy
        ? exercise.measurements[this.measuredBy]
        : undefined
    },
  }))
  .actions(withSetPropAction)

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut
  extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
