// Re-export everything from db and hooks for convenience
export { clearAll, deleteValue, getAllKeys, getValue, setValue } from "./db"
export { useStorageBoolean, useStorageNumber, useStorageString } from "./hooks"

// Re-export db and schema for advanced usage
export { db } from "./db"
export * as schema from "./schema"

