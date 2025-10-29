import { drizzle } from "drizzle-orm/expo-sqlite"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { SQLiteDatabase, deleteDatabaseAsync, openDatabaseSync } from "expo-sqlite"
import { useEffect, useRef, useState } from "react"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

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
  const [isReady, setIsReady] = useState(false)
  const dbRef = useRef<DrizzleDBType | null>(null)
  const sqliteRef = useRef<SQLiteDatabase | null>(null)

  const FORCE_DELETE_DB = true

  useEffect(() => {
    const initDB = async () => {
      try {
        if (FORCE_DELETE_DB) {
          console.log("🗑️ Deleting old database...")
          await deleteDatabaseAsync(SQLiteDBName)
          console.log("✅ Database deleted")
        }

        console.log("📂 Opening database...")
        const sqlite = openDatabaseSync(SQLiteDBName, { enableChangeListener: true })

        await sqlite.execAsync("PRAGMA journal_mode = WAL")
        await sqlite.execAsync("PRAGMA foreign_keys = ON")

        const db = drizzle(sqlite, { schema: { ...schema, ...allRelations } })
        dbRef.current = db
        sqliteRef.current = sqlite
        _drizzle = db

        console.log("✅ Database initialized")
        setIsReady(true)
      } catch (error) {
        console.error("❌ Database initialization failed:", error)
      }
    }

    initDB()
  }, [])

  if (!isReady || !dbRef.current || !sqliteRef.current) {
    return (
      <View>
        <Text>Initializing database...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <DBProviderInitialised
      db={dbRef.current}
      sqlite={sqliteRef.current}
    >
      {children}
    </DBProviderInitialised>
  )
}

function DBProviderInitialised({
  db,
  sqlite,
  children,
}: {
  db: DrizzleDBType
  sqlite: SQLiteDatabase
  children: React.ReactNode
}) {
  useDrizzleStudio(sqlite)

  const [seedingComplete, setSeedingComplete] = useState(false)

  const { success, error } = useMigrations(db, migrations)

  // Seed data after migrations
  useEffect(() => {
    if (!success || seedingComplete) return

    const seed = async () => {
      const result = await db.select().from(schema.exercises).limit(1)

      if (result.length > 0) {
        console.log("Database already has data, skipping seeding")
        setSeedingComplete(true)
      } else {
        console.log("Database is empty, starting seeding...")
        try {
          await seedAll(db)
          console.log("✅ Seeding completed")
          setSeedingComplete(true)
        } catch (err) {
          console.error("❌ Seeding failed:", err)
          setSeedingComplete(true)
        }
      }
    }

    seed()
  }, [success, seedingComplete, db])

  if (error) {
    return <Text>Migration error: {error.message}</Text>
  }

  if (!success) {
    return (
      <View>
        <Text>Running migrations...</Text>
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

  return <DBContext.Provider value={{ sqlite, drizzleDB: db }}>{children}</DBContext.Provider>
}
