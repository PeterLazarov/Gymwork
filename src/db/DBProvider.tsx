import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite"
import { ReactNode, useEffect, useState } from "react"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

import { SQLiteDBName } from "./constants"
import { createTables } from "./expo/createTables"
import { seedSimple } from "./expo/simpleSeed"
import { allRelations } from "./relations"
import { schema } from "./schema"
import { DBContext, DrizzleDBType } from "./useDB"
import migrations from "../../drizzle/migrations.js"

import { ActivityIndicator, View, Text } from "react-native"

const ignoreOnWeb = true

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

  // Enable performance optimizations
  // https://docs.expo.dev/versions/latest/sdk/sqlite/#executing-pragma-queries
  // A workaround for the fact that SQLite is provided async because of web compat setup
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
