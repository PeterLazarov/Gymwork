import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite/next"
import * as schema from "./schema"

// Open the database
const expoDb = openDatabaseSync("storage.db", { enableChangeListener: false })

// Create the drizzle instance
export const db = drizzle(expoDb, { schema })

// Initialize the database by creating tables
export function initializeDatabase() {
  try {
    expoDb.execSync(`
      CREATE TABLE IF NOT EXISTS key_value_storage (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `)
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}

// Initialize database on import
initializeDatabase()

/**
 * Get all keys from the database
 */
export function getAllKeys(): string[] {
  try {
    const results = db.select({ key: schema.keyValueStorage.key }).from(schema.keyValueStorage).all()
    return results.map((r) => r.key)
  } catch {
    return []
  }
}

/**
 * Get a value by key
 */
export function getValue(key: string): string | null {
  try {
    const result = db
      .select({ value: schema.keyValueStorage.value })
      .from(schema.keyValueStorage)
      .where(eq(schema.keyValueStorage.key, key))
      .get()
    return result?.value ?? null
  } catch {
    return null
  }
}

/**
 * Set a value by key
 */
export function setValue(key: string, value: string): void {
  try {
    db.insert(schema.keyValueStorage)
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
    db.delete(schema.keyValueStorage).where(eq(schema.keyValueStorage.key, key)).run()
  } catch (error) {
    console.error(`Failed to delete value for key ${key}:`, error)
  }
}

/**
 * Clear all values
 */
export function clearAll(): void {
  try {
    db.delete(schema.keyValueStorage).run()
  } catch (error) {
    console.error("Failed to clear all values:", error)
  }
}

