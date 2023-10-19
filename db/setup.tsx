import React, { createContext, useContext } from 'react'
import { DataSource } from 'typeorm'

import { Workout, Exercise } from './models'
import { WorkoutRepository, ExerciseRepository } from './repositories'

interface DatabaseConnectionContextData {
  workoutRepository: WorkoutRepository
  exerciseRepository: ExerciseRepository
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
)

type Props = {
  children: React.ReactNode
}

export const DatabaseConnectionProvider: React.FC<Props> = ({ children }) => {
  const datasource = new DataSource({
    type: 'expo',
    database: 'gymwork.db',
    driver: require('expo-sqlite'),
    entities: [Exercise, Workout],

    //   migrations: [CreateTodosTable1608217149351],
    //   migrationsRun: true,

    synchronize: true,
  })

  datasource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!')
    })
    .catch(err => {
      console.error('Error during Data Source initialization', err)
    })

  return (
    <DatabaseConnectionContext.Provider
      value={{
        workoutRepository: new WorkoutRepository(datasource),
        exerciseRepository: new ExerciseRepository(datasource),
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
