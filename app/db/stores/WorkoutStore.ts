import { Instance, SnapshotOut, types, getParent } from 'mobx-state-tree'
import { keepAlive } from 'mobx-utils'

import { withSetPropAction } from '../helpers/withSetPropAction.ts'
import {
  WorkoutSet,
  WorkoutModel,
  WorkoutSnapshotIn,
  Exercise,
  Workout,
  WorkoutSetSnapshotIn,
  WorkoutTemplateModel,
  WorkoutTemplateSnapshotIn,
  WorkoutStepSnapshotIn,
  WorkoutTemplate,
  WorkoutStep,
} from '../models/index.ts'
import workoutSeedData from '../seeds/workout-seed-data.ts'

import { RootStore } from './RootStore.ts'

function getClonedIncompleteNoIdSets(
  sets: WorkoutSet[]
): WorkoutSetSnapshotIn[] {
  return sets.map(({ guid, exercise, completedAt, ...otherProps }) => ({
    exercise: exercise.guid,
    ...otherProps,
    completedAt: null,
  }))
}

export const WorkoutStoreModel = types
  .model('WorkoutStore')
  .props({
    workouts: types.array(WorkoutModel),
    workoutTemplates: types.array(WorkoutTemplateModel),
  })
  .views(store => ({
    get rootStore(): RootStore {
      return getParent(store) as RootStore
    },
    get dateWorkoutMap() {
      const map: Record<Workout['date'], Workout> = {}

      store.workouts.forEach(workout => {
        map[workout.date] = workout
      })
      return map
    },

    get exercisesPerformed(): Exercise[] {
      return [...new Set(this.sortedReverseWorkouts.flatMap(w => w.exercises))]
    },

    get exerciseWorkoutsHistoryMap(): Record<Exercise['guid'], Workout[]> {
      return this.sortedReverseWorkouts.reduce(
        (acc, workout) => {
          workout.exercises.forEach(exercise => {
            const sets = workout.exerciseSetsMap[exercise.guid]
            if (sets && sets.length > 0) {
              if (!acc[exercise.guid]) {
                acc[exercise.guid] = []
              }
              acc[exercise.guid]!.push(workout)
            }
          })

          return acc
        },
        {} as Record<Exercise['guid'], Workout[]>
      )
    },

    /** @returns all sets performed ever */
    get exerciseSetsHistoryMap(): Record<Exercise['guid'], WorkoutSet[]> {
      return Object.fromEntries(
        Object.entries(this.exerciseWorkoutsHistoryMap).map(
          ([exerciseID, workouts]) => {
            const sets = workouts.flatMap<WorkoutSet>(
              w => w.exerciseSetsMap[exerciseID] || []
            )

            return [exerciseID, sets]
          }
        )
      )
    },

    get mostUsedExercises(): Exercise[] {
      const useOrderedExecises = Object.entries(this.exerciseSetsHistoryMap)
        .filter(([, sets]) => sets.length > 0)
        .sort(([, e1Sets], [, e2Sets]) => e2Sets.length - e1Sets.length)

      return (
        useOrderedExecises
          // .slice(0, 10)
          .map(([, sets]) => sets[0]!.exercise)
      )
    },

    get sortedWorkouts(): Workout[] {
      return store.workouts.slice().sort((a, b) => (a.date > b.date ? 1 : -1))
    },
    get sortedReverseWorkouts(): Workout[] {
      return store.workouts.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
    },
    get firstWorkout(): Workout | undefined {
      return this.sortedWorkouts[0]
    },
    get lastWorkout(): Workout | undefined {
      return this.sortedWorkouts.at(-1)
    },
  }))
  .actions(withSetPropAction)
  .actions(self => ({
    async fetch() {
      await this.seed()
    },
    async seed() {
      console.log('seeding workouts')

      self.setProp('workouts', workoutSeedData)
    },
    createWorkout() {
      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
      })
      self.workouts.push(created)
    },
    createWorkoutFromTemplate(template: WorkoutTemplate) {
      const cleanedSteps: WorkoutStepSnapshotIn[] = template.steps.map(
        ({ exercises, type }) => ({
          type,
          exercises: exercises.map(e => e.guid),
          sets: [],
          notes: template.name,
        })
      )
      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        steps: cleanedSteps,
      })
      self.workouts.push(created)
    },
    copyWorkout(template: Workout, includeSets: boolean) {
      const cleanedSteps: WorkoutStepSnapshotIn[] = template.steps.map(
        ({ guid, exercises, sets, ...otherProps }) => ({
          exercises: exercises.map(e => e.guid),
          sets: includeSets ? getClonedIncompleteNoIdSets(sets) : [],
          ...otherProps,
        })
      )

      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        steps: cleanedSteps,
      })
      self.workouts.push(created)
    },
    saveWorkoutTemplate(name: string, templateSteps: WorkoutStep[]) {
      const cleanedSteps: WorkoutStepSnapshotIn[] = templateSteps.map(
        ({ guid, exercises, sets, ...otherProps }) => ({
          exercises: exercises.map(e => e.guid),
          sets: [],
          ...otherProps,
        })
      )

      const created = WorkoutTemplateModel.create({
        name,
        steps: cleanedSteps,
      })
      self.workoutTemplates.push(created)
    },
    removeWorkout(workout: Workout) {
      self.workouts.remove(workout)
    },
    removeTemplate(template: WorkoutTemplate) {
      self.workoutTemplates.remove(template)
    },
  }))
  .actions(self => {
    keepAlive(self, 'exerciseWorkoutsHistoryMap')
    keepAlive(self, 'exerciseSetsHistoryMap')
    return {}
  })

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
