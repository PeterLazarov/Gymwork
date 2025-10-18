import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite"
import { ReactNode, useEffect, useState } from "react"

import { SQLiteDBName } from "./constants"
import { createTables } from "./expo/createTables"
import { seedSimple } from "./expo/simpleSeed"
import { allRelations } from "./relations"
import { schema } from "./schema"
import { DBContext, DrizzleDBType } from "./useDB"

interface DBProviderProps {
  children: ReactNode
}

export function DBProvider({ children }: DBProviderProps) {
  const [db, setDb] = useState<{
    sqlite: SQLiteDatabase
    drizzleDB: DrizzleDBType
  } | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    async function initDB() {
      try {
        // Open the database
        const sqlite = openDatabaseSync(SQLiteDBName, {
          enableChangeListener: true,
        })

        // Create tables if they don't exist
        createTables(sqlite)

        const config = { schema: { ...schema, ...allRelations } }
        console.log({ config })
        console.log({ sqlite })
        // Create drizzle instance
        const drizzleDB = drizzle(sqlite, config)
        // Check if database is already populated
        const existingExercises = await drizzleDB
          .select()
          .from(schema.exercises)
          .limit(1)
          .execute()
          .catch(() => [])

        // If no exercises, seed the database
        if (existingExercises.length === 0) {
          console.log("Seeding database...")
          await seedSimple(drizzleDB).catch((err) => {
            console.error("Error seeding database:", err)
          })
          console.log("Database seeded successfully")
        }

        if (mounted) {
          setDb({ sqlite, drizzleDB })
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }

    initDB()

    return () => {
      mounted = false
    }
  }, [])

  // Show nothing while initializing
  if (!isInitialized || !db) {
    return null
  }

  return <DBContext.Provider value={db}>{children}</DBContext.Provider>
}
