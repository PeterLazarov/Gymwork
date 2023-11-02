import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { ExerciseModel } from './Exercise'
import { WorkoutSetModel } from './WorkoutSet'
import { withSetPropAction } from './helpers/withSetPropAction'

export const WorkoutExerciseModel = types
  .model('WorkoutExercise')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    notes: '',
    exercise: types.safeReference(ExerciseModel),
    sets: types.array(WorkoutSetModel),
  })
  .actions(withSetPropAction)

export interface WorkoutExercise
  extends Instance<typeof WorkoutExerciseModel> {}
export interface WorkoutExerciseSnapshotOut
  extends SnapshotOut<typeof WorkoutExerciseModel> {}
export interface WorkoutExerciseSnapshotIn
  extends SnapshotIn<typeof WorkoutExerciseModel> {}
