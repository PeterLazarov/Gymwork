/**
 * Simple key-value storage for app-level settings
 *
 * Uses a separate SQLite database (storage.db) for lightweight app settings
 * like user preferences, theme, last selected values, etc.
 *
 * For workout data, use the main database via `useDB()` hook.
 *
 * @example
 * ```typescript
 * import { useStorageString } from "@/utils/storage"
 *
 * function MyComponent() {
 *   const [theme, setTheme] = useStorageString("app.theme", "light")
 *   // ...
 * }
 * ```
 */

// Core storage functions
export { clearAll, deleteValue, getAllKeys, getValue, setValue } from "./db"

// React hooks for stateful storage
export { useStorageBoolean, useStorageNumber, useStorageString } from "./hooks"

// Schema for advanced usage
export * as schema from "./schema"

