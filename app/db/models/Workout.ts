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
import { withSetPropAction } from '../helpers/withSetPropAction'
import { Duration } from 'luxon'
import { WorkoutStep, WorkoutStepModel } from './WorkoutStep'
import { WorkoutSet } from './WorkoutSet'

export const WorkoutModel = types
  .model('Workout')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    date: '',
    notes: '',
    steps: types.array(WorkoutStepModel),
    feeling: 'neutral',
  })
  .views(self => ({
    get exercises(): Exercise[] {
      const uniqueExercises = self.steps.reduce(
        (acc, step) => acc.add(step.sets[0].exercise),
        new Set<Exercise>()
      )
      return [...uniqueExercises]
    },
    get stepsMap() {
      const map: Record<WorkoutStep['guid'], WorkoutStep> = {};

      self.steps.forEach(step => {
        map[step.guid] = step
      });

      return map
    },
    get exerciseStepMap() {
      const map: Record<Exercise['guid'], WorkoutStep> = {};

      self.steps.forEach(step => {
        map[step.exercise.guid] = step
      });

      return map
    },
    get exerciseSetsMap() {
      const map: Record<Exercise['guid'], WorkoutSet[]> = {}

      self.steps.forEach(step => {
        map[step.exercise.guid] = step.sets
      });
      return map
    },
    get allSets() {
      return self.steps.flatMap<WorkoutSet>(step => step.sets)
    },
    get firstSet() {
      return this.allSets[0]
    },
    get lastSet() {
      return this.allSets.at(-1)
    },
    /** Only usable for completed workouts */
    get inferredDuration(): Duration {
      const firstSet = this.firstSet
      const lastSet = this.lastSet

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
  }))
  .actions(withSetPropAction)

export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
