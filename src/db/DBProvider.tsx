import { drizzle } from "drizzle-orm/expo-sqlite"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { openDatabaseSync } from "expo-sqlite"
import { useEffect, useState } from "react"

import migrations from "../../drizzle/migrations.js"
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
  const sqlite = openDatabaseSync(SQLiteDBName, {
    enableChangeListener: true,
  })
  const drizzleDB = drizzle(sqlite, { schema: { ...schema, ...allRelations } })

  useDrizzleStudio(sqlite)

  const [pragmasComplete, setPragmasComplete] = useState(false)
  const [seedingComplete, setSeedingComplete] = useState(false)

  _drizzle = drizzleDB

  // Set pragmas first
  useEffect(() => {
    sqlite
      .execAsync("PRAGMA journal_mode = WAL")
      .then(() => sqlite.execAsync("PRAGMA foreign_keys = ON"))
      .then(() => {
        setPragmasComplete(true)
      })
      .catch((err) => {
        console.error("Error setting pragmas:", err)
      })
  }, [])

  const { success, error } = useMigrations(drizzleDB, migrations)

  // Only seed after both pragmas and migrations are complete
  useEffect(() => {
    if (success && pragmasComplete && !seedingComplete) {
      seedAll(drizzleDB)
        .then(() => {
          console.log("Seeding completed successfully")
          setSeedingComplete(true)
        })
        .catch((err) => {
          console.error("Seeding failed:", err)
        })
    }
  }, [success, pragmasComplete, seedingComplete])

  if (error) {
    console.log("drizzle error")
    return <Text> error {error.message}</Text>
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

  return <DBContext.Provider value={{ sqlite, drizzleDB }}>{children}</DBContext.Provider>
}
