import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
  // getIdentifier,
} from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { Exercise } from './Exercise'
import { WorkoutSetModel } from './WorkoutSet'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Duration } from 'luxon'

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
      // ! TODO
      const uniqueExercises = self.sets.reduce(
        // ! accessing set.exercise breaks everything?
        (acc, set) => acc.add(set.exercise),
        new Set<Exercise>()
      )
      return [...uniqueExercises]
    },
    /** Only usable for completed workouts */
    get inferredDuration(): Duration {
      const firstSet = self.sets[0]
      const lastSet = self.sets.at(-1)

      // Your first set takes time
      const padding = Duration.fromDurationLike({ minutes: 1 })

      if (firstSet && lastSet) {
        return Duration.fromMillis(
          lastSet.createdAt.getTime() -
            (firstSet.createdAt.getTime() - firstSet.durationMs)
        ).plus(padding)
      }

      return Duration.fromMillis(0)
    },
    // get exercises(): unknown[] {
    //   const uniqueExercises = self.sets.reduce(
    //     // ! accessing set.exercise breaks everything?
    //     (acc, set) => acc.add(getIdentifier(set.exercise)),
    //     new Set<Exercise>()
    //   )

    //   console.log({ uniqueExercises })

    //   return []
    // },
  }))
  .actions(withSetPropAction)

export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
