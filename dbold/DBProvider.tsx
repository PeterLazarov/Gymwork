import React, { createContext, useContext } from 'react'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'

import {
  Workout,
  Exercise,
  WorkoutExercise,
  WorkoutExerciseSet,
} from './models'
import { runSeeds } from './seeds'

interface DatabaseConnectionContextData {
  workoutRepository: Repository<Workout>
  exerciseRepository: Repository<Exercise>
  workoutExerciseRepository: Repository<WorkoutExercise>
  workoutExerciseSetRepository: Repository<WorkoutExerciseSet>
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
)

type Props = {
  children: React.ReactNode
}

export const DatabaseConnectionProvider: React.FC<Props> = ({ children }) => {
  const options: DataSourceOptions = {
    type: 'expo',
    database: 'gymwork.db',
    driver: require('expo-sqlite'),
    entities: [Exercise, Workout, WorkoutExercise, WorkoutExerciseSet],

    //   migrations: [CreateTodosTable1608217149351],
    //   migrationsRun: true,

    synchronize: true,
  }

  const datasource = new DataSource(options)

  datasource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!')
      runSeeds(datasource)
    })
    .catch(err => {
      console.error('Error during Data Source initialization', err)
    })

  return (
    <DatabaseConnectionContext.Provider
      value={{
        workoutRepository: datasource.getRepository(Workout),
        exerciseRepository: datasource.getRepository(Exercise),
        workoutExerciseRepository: datasource.getRepository(WorkoutExercise),
        workoutExerciseSetRepository:
          datasource.getRepository(WorkoutExerciseSet),
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  )
}

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext)

  return context
}
