import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  getSnapshot,
  types,
  // getIdentifier,
} from 'mobx-state-tree'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { Exercise } from './Exercise'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { DateTime, Duration } from 'luxon'
import { WorkoutStep, WorkoutStepModel } from './WorkoutStep'
import { WorkoutSet } from './WorkoutSet'

const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })

export const WorkoutModel = types
  .model('Workout')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    date: '',
    steps: types.array(WorkoutStepModel),
    notes: '',
    feeling: 'neutral',
    exhaustion: 1
  })
  .views(self => ({
    get exercises(): Exercise[] {
      const uniqueExercises = self.steps.reduce(
        (acc, step) => acc.add(step.exercise),
        new Set<Exercise>()
      )
      return [...uniqueExercises]
    },
    get stepsMap() {
      const map: Record<WorkoutStep['guid'], WorkoutStep> = {}

      self.steps.forEach(step => {
        map[step.guid] = step
      })

      return map
    },
    get exerciseStepMap() {
      const map: Record<Exercise['guid'], WorkoutStep> = {}

      self.steps.forEach(step => {
        map[step.exercise.guid] = step
      })

      return map
    },
    get exerciseSetsMap() {
      const map: Record<Exercise['guid'], WorkoutSet[]> = {}

      self.steps.forEach(step => {
        map[step.exercise.guid] = step.sets
      })
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
    get inferredHistoricalDuration(): Duration {
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
    get duration(): string {
      return this.isToday ? '': this.inferredHistoricalDuration.toFormat('hh:mm')
    },
    get isToday() {
      return self.date === today.toISODate()
    }
  }))
  .actions(withSetPropAction)
  .actions(workout => ({
    addStep(exercise: Exercise) {
      const updatedSteps = (workout.steps || []).map(step => getSnapshot(step))
      updatedSteps.push({
        exercise: exercise.guid,
        sets: [],
        guid: uuidv4(),
      })
      workout.setProp('steps', updatedSteps)
      return workout.steps.at(-1)!
    },

    removeStep(step: WorkoutStep) {
      const sets = step.sets
      sets?.forEach(set => {
        step.removeSet(set.guid)
      })
      const remainingSteps = workout.steps.filter(s => s.guid !== step.guid)
      workout.setProp(
        'steps',
        remainingSteps.map(s => getSnapshot(s))
      )
    },
  }))

export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
