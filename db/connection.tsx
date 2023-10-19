import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ActivityIndicator } from 'react-native'
import { Connection, createConnection } from 'typeorm'

import { Workout } from './models'
import { WorkoutRepository } from './repositories'

interface DatabaseConnectionContextData {
  workoutRepository: WorkoutRepository
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
)

type Props = {
  children: React.ReactNode
}

export const DatabaseConnectionProvider: React.FC<Props> = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null)

  const connect = useCallback(async () => {
    const createdConnection = await createConnection({
      type: 'expo',
      database: 'gymwork.db',
      driver: require('expo-sqlite'),
      entities: [Workout],

      //   migrations: [CreateTodosTable1608217149351],
      //   migrationsRun: true,

      synchronize: true,
    })

    setConnection(createdConnection)
  }, [])

  useEffect(() => {
    console.log({ connection })
    if (!connection) {
      connect()
    }
  }, [connect, connection])

  if (!connection) {
    return <ActivityIndicator />
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        workoutRepository: new WorkoutRepository(connection),
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
