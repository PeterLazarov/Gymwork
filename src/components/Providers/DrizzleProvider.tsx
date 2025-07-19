import { useEffect, useState } from "react"
import { ActivityIndicator, Platform, View } from "react-native"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"
import { useSQLiteContext } from "expo-sqlite"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"

import { ErrorDetails } from "@/components/Ignite/ErrorBoundary/ErrorDetails"
import { Text } from "@/components/Ignite/Text"
import { allRelations } from "@/db/sqlite/relations"
import { schema } from "@/db/sqlite/schema"

import migrations from "../../../drizzle/migrations.js"
import { DBContext, DrizzleDBType } from "../../db/sqlite/useDB"

const ignoreOnWeb = true

let _drizzle: DrizzleDBType
export function getDrizzle(): DrizzleDBType {
  return _drizzle
}

export default function DrizzleProvider({ children }: { children: React.ReactNode }) {
  const sqlite = useSQLiteContext()
  const drizzleDB = drizzle(sqlite, { schema: { ...schema, ...allRelations } })

  useDrizzleStudio(sqlite)

  const [pragmasComplete, setPragmasComplete] = useState(false)

  // Enable performance optimizations
  // https://docs.expo.dev/versions/latest/sdk/sqlite/#executing-pragma-queries
  useEffect(() => {
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
  }, [])

  const { success, error } = useMigrations(drizzleDB, migrations)

  if (error && !(Platform.OS === "web" && ignoreOnWeb)) {
    console.log("drizzle error")
    return (
      <ErrorDetails
        error={error}
        errorInfo={"Drizzle Migration Error"}
        onReset={() => {}}
      ></ErrorDetails>
    )
  }

  if (!success && !(Platform.OS === "web" && ignoreOnWeb)) {
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
