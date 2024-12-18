import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { keepAlive } from 'mobx-utils'

import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import {
  Exercise,
  ExerciseModel,
  ExerciseSnapshotIn,
  measurementDefaults,
} from 'app/db/models'
import exerciseSeedData from 'app/db/seeds/exercises-seed-data.json'
import { uniqueValues } from 'app/utils/array'
import { isDev } from 'app/utils/isDev'
import * as storage from 'app/utils/storage'

export const ExerciseStoreModel = types
  .model('ExerciseStore')
  .props({
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      if (store.exercises.length === 0) {
        const exercises = await storage.load<ExerciseSnapshotIn[]>('exercises')

        if (exercises && exercises?.length > 0 && !isDev) {
          store.setProp('exercises', exercises)
        } else {
          await this.seed()
        }
      }
    },
    async seed() {
      console.log('seeding excercises')

      const exercisesData: ExerciseSnapshotIn[] = exerciseSeedData.map(
        ({ measurementType, ...exercise }, i): ExerciseSnapshotIn => {
          return {
            ...exercise,
            guid: String(i),
            measurements: Object.fromEntries(
              measurementType.map(type => [type, measurementDefaults[type]])
            ),
          }
        }
      )
      store.setProp('exercises', exercisesData)
    },
    editExercise(updated: Exercise) {
      const mappedArray = store.exercises.map(e =>
        e.guid === updated.guid ? updated : e
      )
      store.setProp('exercises', mappedArray)
    },
    createExercise(created: Exercise) {
      store.exercises.push(created)
    },
  }))
  .views(store => ({
    get muscleOptions() {
      return uniqueValues(
        store.exercises.flatMap<string>(e => e.muscles)
      ).sort()
    },
    get exercisesMap() {
      const map: Record<Exercise['guid'], Exercise> = {}

      store.exercises.forEach(exercise => {
        map[exercise.guid] = exercise
      })
      return map
    },
    get exercisesByMuscle() {
      const acc = Object.fromEntries(
        this.muscleOptions.map(muscle => [muscle, [] as Exercise[]])
      )

      store.exercises
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(exercise => {
          exercise.muscles.forEach(muscle => {
            acc[muscle].push(exercise)
          })
        })

      return acc
    },
    get favoriteExercises() {
      return store.exercises.filter(e => e.isFavorite)
    },
  }))
  .actions(self => {
    keepAlive(self, 'muscleOptions')
    keepAlive(self, 'exercisesMap')
    keepAlive(self, 'exercisesByMuscle')
    keepAlive(self, 'favoriteExercises')
    return {}
  })

export interface ExerciseStore extends Instance<typeof ExerciseStoreModel> {}
export interface ExerciseStoreSnapshot
  extends SnapshotOut<typeof ExerciseStoreModel> {}
