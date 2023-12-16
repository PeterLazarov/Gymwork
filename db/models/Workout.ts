import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { Exercise } from './Exercise'
import { WorkoutSetModel } from './WorkoutSet'
import { withSetPropAction } from '../helpers/withSetPropAction'

export const WorkoutModel = types
  .model('Workout')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    date: '',
    notes: '',
    sets: types.array(WorkoutSetModel),
    feeling: 'neutral',
  })
  .views(self => ({
    get exercises(): Exercise[] {
      const uniqueExercises = self.sets.reduce(
        (acc, set) => acc.add(set.exercise),
        new Set<Exercise>()
      )
      return [...uniqueExercises]
    },
  }))
  .actions(withSetPropAction)

export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
