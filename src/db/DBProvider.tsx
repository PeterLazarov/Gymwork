import { drizzle } from "drizzle-orm/expo-sqlite"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { deleteDatabaseAsync, openDatabaseSync } from "expo-sqlite"
import { useEffect, useRef, useState } from "react"

import migrations from "../../drizzle/migrations"
import { SQLiteDBName } from "./constants"
import { allRelations } from "./relations"
import { schema } from "./schema"
import { DBContext, DrizzleDBType } from "./useDB"

import { ActivityIndicator, Text, View } from "react-native"
import { seedAll } from "./expo/expoSeeder"

let _drizzle: DrizzleDBType
export function getDrizzle(): DrizzleDBType {
  return _drizzle
}

export default function DBProvider({ children }: { children: React.ReactNode }) {
  const sqliteRef = useRef<ReturnType<typeof openDatabaseSync> | null>(null)
  const drizzleDBRef = useRef<DrizzleDBType | null>(null)

  const [dbInitialized, setDbInitialized] = useState(false)
  const [pragmasComplete, setPragmasComplete] = useState(false)
  const [seedingComplete, setSeedingComplete] = useState(false)
  const [dbDeleted, setDbDeleted] = useState(false)

  // TODO: Set back to false after database is recreated with views
  const FORCE_DELETE_DB = true

  // Delete database before opening if needed
  useEffect(() => {
    if (FORCE_DELETE_DB && !dbDeleted) {
      console.log("🗑️ Deleting old database to apply new migrations...")
      deleteDatabaseAsync(SQLiteDBName)
        .then(() => {
          console.log("✅ Database deleted, will now initialize fresh...")
          setDbDeleted(true)
        })
        .catch((err) => {
          console.error("Error deleting database:", err)
          // Even if delete fails, mark as deleted to proceed
          setDbDeleted(true)
        })
      return
    }
    if (!FORCE_DELETE_DB) {
      setDbDeleted(true)
    }
  }, [dbDeleted, FORCE_DELETE_DB])

  // Initialize database after deletion check
  if (!sqliteRef.current && dbDeleted) {
    try {
      const db = openDatabaseSync(SQLiteDBName, {
        enableChangeListener: true,
      })
      sqliteRef.current = db
      const drizzle_db = drizzle(db, {
        schema: { ...schema, ...allRelations },
      })
      drizzleDBRef.current = drizzle_db
      _drizzle = drizzle_db
      setDbInitialized(true)
    } catch (error) {
      console.error("Error opening database:", error)
    }
  }

  useDrizzleStudio(sqliteRef.current!)

  // Set pragmas first
  useEffect(() => {
    if (!sqliteRef.current) return

    sqliteRef.current
      .execAsync("PRAGMA journal_mode = WAL")
      .then(() => sqliteRef.current!.execAsync("PRAGMA foreign_keys = ON"))
      .then(() => {
        setPragmasComplete(true)
      })
      .catch((err) => {
        console.error("Error setting pragmas:", err)
      })
  }, [dbInitialized])

  const { success, error } = useMigrations(drizzleDBRef.current!, migrations)

  useEffect(() => {
    async function seedProcess() {
      if (!drizzleDBRef.current) return

      const result = await drizzleDBRef.current.select().from(schema.exercises).limit(1).execute()

      console.log({ result })
      if (result.length > 0) {
        console.log("Database already has data, skipping seeding")
        setSeedingComplete(true)
        return Promise.resolve()
      } else {
        console.log("Database is empty, starting seeding...")
        seedAll(drizzleDBRef.current)
          .then(() => {
            console.log("Seeding completed successfully")
            setSeedingComplete(true)
          })
          .catch((err) => {
            console.error("Seeding failed:", err)
            setSeedingComplete(true)
          })
      }
    }
    console.log({ success, pragmasComplete, seedingComplete })
    if (success && pragmasComplete && !seedingComplete && drizzleDBRef.current) {
      console.log("start SEEDIING")
      seedProcess()
    }
  }, [success, pragmasComplete, seedingComplete])

  if (error) {
    console.log("drizzle error")
    return <Text> error {error.message}</Text>
  }

  if (!dbInitialized) {
    return (
      <View>
        <Text>Opening database...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!pragmasComplete) {
    return (
      <View>
        <Text>Setting up database...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!seedingComplete) {
    return (
      <View>
        <Text>Loading data...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <DBContext.Provider value={{ sqlite: sqliteRef.current!, drizzleDB: drizzleDBRef.current! }}>
      {children}
    </DBContext.Provider>
  )
}
