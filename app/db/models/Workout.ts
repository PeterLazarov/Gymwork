import convert from 'convert-units'
import { DateTime, Duration } from 'luxon'
import pkg from 'mobx-state-tree'
const { Instance, SnapshotIn, SnapshotOut, getSnapshot, recordPatches, types } =
  pkg
import { v4 as uuidv4 } from 'uuid'

import { withSetPropAction } from '../helpers/withSetPropAction.ts'

import { type Exercise } from './Exercise.ts'
import { type WorkoutSet } from './WorkoutSet.ts'
import {
  type WorkoutStep,
  type WorkoutStep,
  WorkoutStepModel,
} from './WorkoutStep.ts'

const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
// TODO dedupe
const defaultDelay = convert(30).from('min').to('ms')

const feelings = {
  sad: 'sad',
  neutral: 'neutral',
  happy: 'happy',
} as const
const discomfort = {
  pain: 'pain',
  discomfort: 'discomfort',
  noPain: 'noPain',
} as const

export type WorkoutComments = {
  notes: string
  feeling?: (typeof feelings)[keyof typeof feelings]
  pain?: (typeof discomfort)[keyof typeof discomfort]
  rpe?: number
}

export const WorkoutModel = types
  .model('Workout')
  .props({
    guid: types.optional(types.identifier, () => uuidv4()),
    date: '',
    steps: types.array(WorkoutStepModel),
    notes: '',
    feeling: types.maybe(types.enumeration('feeling', Object.values(feelings))),
    pain: types.maybe(types.enumeration('pain', Object.values(discomfort))),
    rpe: types.maybe(types.number), // TODO rename to effort?

    // TODO rename to timerStoppedAt?
    /** Used for timers */
    endedAt: types.maybe(types.Date),
    // Manually set by the timer
    durationMs: types.maybe(types.number),
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
          const mapSteps = map[exercise.guid]
          if (mapSteps) mapSteps.push(step)
          else map[exercise.guid] = [step]
        })
      })

      return map
    },
    get exerciseSetsMap() {
      const map: Record<Exercise['guid'], WorkoutSet[]> = {}

      self.steps.forEach(step => {
        step.exercises.forEach(exercise => {
          const toAdd = step.exerciseSetsMap[exercise.guid] ?? []
          const mapSets = map[exercise.guid]
          if (mapSets) mapSets.push(...toAdd)
          else map[exercise.guid] = [...toAdd]
        })
      })
      return map
    },
    get allSets() {
      return self.steps.flatMap<WorkoutSet>(step => step.sets)
    },
    /** Set added first */
    get firstAddedSet() {
      return this.allSets[0]
    },
    /** Set added last */
    get lastAddedSet() {
      return this.allSets.at(-1)
    },
    get inferredHistoricalDuration(): Duration | undefined {
      // TODO do we need this???
      // console.log({ endedAt: self.endedAt })
      if (!self.endedAt) return undefined

      const setsAddedAtDayOfWorkout = this.allSets
        .filter(set => set.date === self.date)
        // Sorted because reordering sets could otherwise mess things up
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      const firstSet = setsAddedAtDayOfWorkout[0]
      const lastSet = setsAddedAtDayOfWorkout.at(-1)

      if (!firstSet || !lastSet) return undefined

      // Your first set takes time
      const padding = Duration.fromDurationLike({ minutes: 1 })

      return Duration.fromMillis(
        lastSet.createdAt.getTime() -
          (firstSet.createdAt.getTime() - (firstSet.durationMs ?? 0))
      ).plus(padding)
    },
    // TODO do we need this?
    get duration(): Duration | undefined {
      if (self.durationMs) return Duration.fromMillis(self.durationMs)
      return this.inferredHistoricalDuration
    },
    get isToday() {
      return self.date === today.toISODate()
    },
    get hasComments() {
      const hasNotes = self.notes !== ''

      return hasNotes || self.rpe || self.pain || self.feeling
    },
    get comments(): WorkoutComments {
      return {
        notes: self.notes,
        feeling: self.feeling,
        pain: self.pain,
        rpe: self.rpe,
      }
    },
    get hasIncompleteSets(): boolean {
      return this.allSets.some(set => set.completed === false)
    },

    get muscles(): string[] {
      return Array.from(
        new Set(this.exercises.flatMap(e => e.muscles))
      ) as string[]
    },
    get muscleAreas(): string[] {
      return Array.from(
        new Set(this.exercises.flatMap(e => e.muscleAreas))
      ) as string[]
    },
  }))
  .actions(withSetPropAction)
  .actions(workout => ({
    addStep(exercises: Exercise[], type: WorkoutStep['type'] = 'straightSet') {
      const updatedSteps = (workout.steps || []).map(step => getSnapshot(step))
      updatedSteps.push({
        exercises: exercises.map(e => e.guid),
        sets: [],
        guid: uuidv4(),
        type,
      })
      workout.setProp('steps', updatedSteps)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return workout.steps.at(-1)!
    },

    removeStep(step: WorkoutStep): () => void {
      const recorder = recordPatches(workout)

      const sets = step.sets
      sets?.forEach(set => {
        step.removeSet(set.guid)
      })
      const remainingSteps = workout.steps.filter(s => s.guid !== step.guid)
      workout.setProp(
        'steps',
        remainingSteps.map(s => getSnapshot(s))
      )
      recorder.stop()

      return () => recorder.undo()
    },
    saveComments(comments: WorkoutComments) {
      workout.notes = comments.notes
      workout.feeling = comments.feeling
      workout.pain = comments.pain
      workout.rpe = comments.rpe
    },
    afterCreate() {
      // End workout if over 30m have passed since last set
      const lastSetCreatedAt = workout.lastAddedSet?.createdAt
      if (
        !workout.endedAt &&
        lastSetCreatedAt &&
        Date.now() - lastSetCreatedAt.getTime() > defaultDelay
      ) {
        workout.endedAt = lastSetCreatedAt
      }
    },
  }))

export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
export interface Workout extends Instance<typeof WorkoutModel> {}
export interface WorkoutSnapshotOut extends SnapshotOut<typeof WorkoutModel> {}
export interface WorkoutSnapshotIn extends SnapshotIn<typeof WorkoutModel> {}
