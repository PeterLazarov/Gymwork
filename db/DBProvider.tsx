import React, { createContext, useContext, useState } from 'react'
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

const entities = [Exercise, Workout, WorkoutExercise, WorkoutExerciseSet]

export const DatabaseConnectionProvider: React.FC<Props> = ({ children }) => {
  const options: DataSourceOptions = {
    type: 'expo',
    database: 'gymwork.db',
    // database: '1.db',
    driver: require('expo-sqlite'),
    entities,

    // logging: true,
    //   migrations: [CreateTodosTable1608217149351],
    //   migrationsRun: true,

    synchronize: true,
  }

  const datasource = new DataSource(options)

  // datasource

  const [showChildren, setShowChildren] = useState(false)

  ;(async () => {
    try {
      await datasource.initialize()
      console.log('Data Source has been initialized!')

      await Promise.all(
        entities.map(entity => datasource.getRepository(entity).clear())
      )
      console.log('Data Source has been cleared!')

      await runSeeds(datasource)
      console.log('Data Source has been seeded!')

      setShowChildren(true)
    } catch (err) {
      console.error('Error during Data Source initialization', err)
    }
  })()

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
      {showChildren && children}
    </DatabaseConnectionContext.Provider>
  )
}

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext)

  return context
}
