import pkg from 'mobx-state-tree'
const { Instance, SnapshotOut, types } = pkg
import { keepAlive } from 'mobx-utils'

// FIX: lodash import for CommonJS compatibility
import pkgLodash from 'lodash'
const { difference } = pkgLodash

import { withSetPropAction } from '../helpers/withSetPropAction.ts'
import {
  type Exercise,
  ExerciseModel,
  type ExerciseSnapshotIn,
} from '../models/index.ts'
import { uniqueValues } from '../../utils/array.ts'

import { exercises as exerciseSeedData } from '../seeds/exerciseSeed.ts'

export const ExerciseStoreModel = types
  .model('ExerciseStore')
  .props({
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetch() {
      await this.seed()
    },
    async seed() {
      console.log('seeding exercises')

      store.exercises = Object.values(exerciseSeedData)
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
    get exercisesSorted() {
      return store.exercises
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    get muscleAreaOptions() {
      return uniqueValues(
        store.exercises.flatMap<string>(e => e.muscleAreas)
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
