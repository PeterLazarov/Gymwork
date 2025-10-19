import { drizzle } from "drizzle-orm/expo-sqlite"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { openDatabaseSync } from "expo-sqlite"
import { useEffect, useState } from "react"

import migrations from "../../drizzle/migrations.js"
import { SQLiteDBName } from "./constants"
import { seedSimple } from "./expo/simpleSeed"
import { allRelations } from "./relations"
import { schema } from "./schema"
import { DBContext, DrizzleDBType } from "./useDB"

import { ActivityIndicator, Text, View } from "react-native"

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

  useEffect(() => {
    seedSimple(drizzleDB)
  }, [])
  _drizzle = drizzleDB

  sqlite
    .execAsync("PRAGMA journal_mode = WAL")
    .then(() => {
      sqlite.execAsync("PRAGMA foreign_keys = ON")
    })
    .then(() => {
      setPragmasComplete(true)
    })

  const { success, error } = useMigrations(drizzleDB, migrations)

  if (error) {
    console.log("drizzle error")
    return <Text> error {error.message}</Text>
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!pragmasComplete) {
    return (
      <View>
        <Text>Optimization is in progress...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <DBContext.Provider value={{ sqlite, drizzleDB }}>{children}</DBContext.Provider>
}
