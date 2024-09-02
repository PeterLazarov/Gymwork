import {
  Instance,
  SnapshotOut,
  types,
  getParent,
} from 'mobx-state-tree'

import { RootStore } from './RootStore'
import * as storage from 'app/utils/storage'
import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import workoutSeedData from 'app/db/seeds/workout-seed-data'
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
} from 'app/db/models'
import { isDev } from 'app/utils/isDev'

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

    get exerciseWorkoutsHistoryMap(): Record<Exercise['guid'], Workout[]> {
      return this.sortedReverseWorkouts.reduce((acc, workout) => {
        workout.exercises.forEach(exercise => {
          if (!acc[exercise.guid]) {
            acc[exercise.guid] = []
          }
          acc[exercise.guid].push(workout)
        })

        return acc
      }, {} as Record<Exercise['guid'], Workout[]>)
    },

    /** @returns all sets performed ever */
    get exerciseSetsHistoryMap(): Record<Exercise['guid'], WorkoutSet[]> {
      return Object.fromEntries(
        Object.entries(this.exerciseWorkoutsHistoryMap).map(
          ([exerciseID, workouts]) => {
            const sets = workouts.flatMap<WorkoutSet>(
              w => w.exerciseSetsMap[exerciseID]
            )

            return [exerciseID, sets]
          }
        )
      )
    },
    get mostUsedExercises(): Exercise[] {
      const exercisesArray = Object.values(this.exerciseSetsHistoryMap);
      const exerciseCounts: {exercise: Exercise, count: number}[] = [];

      exercisesArray.forEach(sets => {
        if (sets.length > 0) {
          exerciseCounts.push({
            exercise: sets[0].exercise,
            count: sets.length
          });
        }
      });

      exerciseCounts.sort((a, b) => b.count - a.count);

      return exerciseCounts.slice(0, 10).map(({ exercise }) => exercise);
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
      const workouts = await storage.load<WorkoutSnapshotIn[]>('workouts')
      const workoutTemplates = await storage.load<WorkoutTemplateSnapshotIn[]>('workoutTemplates')
      
      if (workoutTemplates && workoutTemplates?.length > 0) {
        self.setProp('workoutTemplates', workoutTemplates)
      }
      if (workouts && workouts?.length > 0 && isDev) {
        self.setProp('workouts', workouts)
      } else {
        await this.seed()
      }
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
        ({ exercise }) => ({
          exercise: exercise.guid,
          sets: [],
        })
      )
      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        steps: cleanedSteps
      })
      self.workouts.push(created)
    },
    copyWorkout(template: Workout, includeSets: boolean) {
      const getCleanedSets = (sets: WorkoutSet[]): WorkoutSetSnapshotIn[] => {
        return sets.map(({ guid, exercise, ...otherProps }) => ({
          exercise: exercise.guid,
          ...otherProps,
        }))
      }

      const cleanedSteps: WorkoutStepSnapshotIn[] = template.steps.map(
        ({ guid, exercise, sets, ...otherProps }) => ({
          exercise: exercise.guid,
          sets: includeSets ? getCleanedSets(sets) : [],
          ...otherProps,
        })
      )

      const created = WorkoutModel.create({
        date: self.rootStore.stateStore.openedDate,
        steps: cleanedSteps,
      })
      self.workouts.push(created)
    },
    saveWorkoutTemplate(name: string) {
      const template = self.rootStore.stateStore.openedWorkout!

      const cleanedSteps: WorkoutStepSnapshotIn[] = template.steps.map(
        ({ guid, exercise, sets, ...otherProps }) => ({
          exercise: exercise.guid,
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

export interface WorkoutStore extends Instance<typeof WorkoutStoreModel> {}
export interface WorkoutStoreSnapshot
  extends SnapshotOut<typeof WorkoutStoreModel> {}
