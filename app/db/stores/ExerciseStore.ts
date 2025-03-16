import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { keepAlive } from 'mobx-utils'

import { withSetPropAction } from 'app/db/helpers/withSetPropAction'
import { Exercise, ExerciseModel, ExerciseSnapshotIn } from 'app/db/models'
import { uniqueValues } from 'app/utils/array'
import { isDev } from 'app/utils/isDev'
import * as storage from 'app/utils/storage'

import { exercises as exerciseSeedData } from '../seeds/exerciseSeed'

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
    get exercisesSorted(){
      return store.exercises.slice().sort((a,b)=> a.name.localeCompare(b.name))
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
