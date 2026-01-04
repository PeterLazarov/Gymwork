import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite"
import { createDrizzleLoggerMiddleware } from "../../observability"
import * as schema from "./schema"

// Lazy initialization
let db: ReturnType<typeof drizzle<typeof schema>> | null = null
let expoDb: ReturnType<typeof openDatabaseSync> | null = null

function initializeDatabase() {
  if (db) return db

  try {
    // Open the database for simple app settings storage
    const sqlite = openDatabaseSync("storage.db", { enableChangeListener: false })
    expoDb = createDrizzleLoggerMiddleware(sqlite)

    // Create tables if they don't exist
    expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS key_value_storage (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `)

    // Create the drizzle instance
    db = drizzle(expoDb, { schema })

    return db
  } catch (error) {
    console.error("Failed to initialize storage database:", error)
    throw error
  }
}

function getDb() {
  if (!db) {
    initializeDatabase()
  }
  return db!
}

/**
 * Get all keys from the storage
 */
export function getAllKeys(): string[] {
  try {
    const database = getDb()
    const results = database.select({ key: schema.keyValueStorage.key })
      .from(schema.keyValueStorage)
      .all()
    return results.map((r) => r.key)
  } catch (error) {
    console.error("Failed to get all keys:", error)
    return []
  }
}

/**
 * Get a value by key
 */
export function getValue(key: string): string | null {
  try {
    const database = getDb()
    const result = database
      .select({ value: schema.keyValueStorage.value })
      .from(schema.keyValueStorage)
      .where(eq(schema.keyValueStorage.key, key))
      .get()
    return result?.value ?? null
  } catch (error) {
    console.error(`Failed to get value for key ${key}:`, error)
    return null
  }
}

/**
 * Set a value by key (creates or updates)
 */
export function setValue(key: string, value: string): void {
  try {
    const database = getDb()
    database.insert(schema.keyValueStorage)
      .values({ key, value })
      .onConflictDoUpdate({
        target: schema.keyValueStorage.key,
        set: { value },
      })
      .run()
  } catch (error) {
    console.error(`Failed to set value for key ${key}:`, error)
  }
}

/**
 * Delete a value by key
 */
export function deleteValue(key: string): void {
  try {
    const database = getDb()
    database.delete(schema.keyValueStorage)
      .where(eq(schema.keyValueStorage.key, key))
      .run()
  } catch (error) {
    console.error(`Failed to delete value for key ${key}:`, error)
  }
}

/**
 * Clear all values from storage
 */
export function clearAll(): void {
  try {
    const database = getDb()
    database.delete(schema.keyValueStorage).run()
  } catch (error) {
    console.error("Failed to clear all values:", error)
  }
}

