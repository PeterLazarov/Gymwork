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

const feelings = {
  sad: 'sad',
  neutral: 'neutral',
  happy: 'happy',
} as const
const painOptions = {
  pain: 'pain',
  discomfort: 'discomfort',
  noPain: 'noPain',
} as const
const intensityOptions = {
  easy: 'easy',
  standard: 'standard',
  intense: 'intense',
} as const

export const WorkoutModel = types
  .model('Workout')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    date: '',
    steps: types.array(WorkoutStepModel),
    notes: '',
    feeling: types.optional(
      types.enumeration('feeling', Object.values(feelings)),
      () => feelings.neutral
    ),
    pain: types.optional(
      types.enumeration('pain', Object.values(painOptions)),
      () => painOptions.noPain
    ),
    intensity: types.optional(
      types.enumeration('intensity', Object.values(intensityOptions)),
      () => intensityOptions.standard
    ),
  })
  .views(self => ({
    get exercises(): Exercise[] {
      const uniqueExercises = self.steps
        .flatMap<Exercise>(s => s.exercises)
        .reduce((acc, exercise) => acc.add(exercise), new Set<Exercise>())
      return [...uniqueExercises]
    },
    get stepsMap() {
      const map: Record<WorkoutStep['guid'], WorkoutStep> = {}

      self.steps.forEach(step => {
        map[step.guid] = step
      })

      return map
    },
    get exerciseStepsMap() {
      const map: Record<Exercise['guid'], WorkoutStep[]> = {}

      self.steps.forEach(step => {
        step.exercises.forEach(exercise => {
          if (!map[exercise.guid]) {
            map[exercise.guid] = []
          }
          map[exercise.guid].push(step)
        })
      })

      return map
    },
    get exerciseSetsMap() {
      const map: Record<Exercise['guid'], WorkoutSet[]> = {}

      self.steps.forEach(step => {
        step.exercises.forEach(exercise => {
          if (!map[exercise.guid]) {
            map[exercise.guid] = []
          }
          map[exercise.guid].push(...step.exerciseSetsMap[exercise.guid])
        })
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
    get duration(): Duration | null {
      return this.isToday ? null : this.inferredHistoricalDuration
    },
    get isToday() {
      return self.date === today.toISODate()
    },
    get hasComments() {
      const hasNotes = self.notes !== ''
      const hasIntensity = self.intensity !== 'standard'
      const hasPain = self.pain !== 'noPain'
      const hasFeeling = self.feeling !== 'neutral'

      return hasNotes || hasIntensity || hasPain || hasFeeling
    },
  }))
  .actions(withSetPropAction)
  .actions(workout => ({
    addStep(exercises: Exercise[], type: WorkoutStep['type']) {
      const updatedSteps = (workout.steps || []).map(step => getSnapshot(step))
      updatedSteps.push({
        exercises: exercises.map(e => e.guid),
        sets: [],
        guid: uuidv4(),
        type,
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
