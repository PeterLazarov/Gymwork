# Simple Storage for App Settings

This directory provides a lightweight key-value storage system for **app-level settings and preferences**.

## Purpose

**Use this storage for:**
- ✅ App theme preferences
- ✅ UI state (last selected tab, scroll position)
- ✅ User preferences and settings
- ✅ Feature flags
- ✅ Simple key-value data

**DO NOT use this storage for:**
- ❌ Workout data (exercises, sets, workouts)
- ❌ Complex relational data
- ❌ Data that needs queries and relationships

> **For workout data**, use the main database via `useDB()` hook from `@/db/useDB`.

## Two Storage Systems in This App

| Storage System | Database File | Purpose | Import From |
|----------------|---------------|---------|-------------|
| **Simple Storage** | `storage.db` | App settings & preferences | `@/utils/storage` |
| **Main Database** | `db.db` | Exercises, workouts, sets | `@/db/useDB` |

## Quick Start

### React Hooks (Recommended)

Use these hooks like `useState`, but with automatic persistence:

```typescript
import { useStorageString, useStorageNumber, useStorageBoolean } from "@/utils/storage"

function SettingsScreen() {
  // String value with default
  const [theme, setTheme] = useStorageString("app.theme", "light")

  // Number value with default
  const [selectedTab, setSelectedTab] = useStorageNumber("app.lastTab", 0)

  // Boolean value with default
  const [notifications, setNotifications] = useStorageBoolean("app.notifications", true)

  return (
    <View>
      <Button onPress={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme ({theme})
      </Button>

      <Switch value={notifications} onValueChange={setNotifications} />
    </View>
  )
}
```

### Direct Operations

For non-React code or advanced usage:

```typescript
import { getValue, setValue, deleteValue, clearAll, getAllKeys } from "@/utils/storage"

// Set a value
setValue("user.language", "en")

// Get a value (returns null if not found)
const language = getValue("user.language") // "en"

// Save objects (JSON serialize/deserialize)
setValue("user.prefs", JSON.stringify({ fontSize: 16, sound: true }))
const prefs = JSON.parse(getValue("user.prefs")!)

// Delete a value
deleteValue("user.language")

// Get all keys
const allKeys = getAllKeys() // ["app.theme", "app.lastTab", ...]

// Clear everything (use carefully!)
clearAll()
```

## Example: Working with Workout Data

For workout data, use the main database instead:

```typescript
import { useDB } from "@/db/useDB"
import { useState, useEffect } from "react"

function ExerciseListScreen() {
  const { drizzleDB } = useDB()
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    async function loadExercises() {
      const results = await drizzleDB.query.exercises.findMany({
        orderBy: (exercises, { asc }) => [asc(exercises.name)],
      })
      setExercises(results)
    }
    loadExercises()
  }, [drizzleDB])

  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => <ExerciseItem exercise={item} />}
    />
  )
}
```

## Implementation Details

- **Database**: SQLite via expo-sqlite
- **ORM**: Drizzle ORM for type-safe queries
- **Initialization**: Lazy (only initializes when first used)
- **Schema**: Simple `key_value_storage` table with TEXT primary key
- **Thread-safe**: Yes (SQLite handles concurrency)

## Files

- `db.ts` - Core storage operations with lazy initialization
- `schema.ts` - Drizzle schema definition
- `hooks.ts` - React hooks for persistent state
- `index.ts` - Convenient exports
- `storage.test.ts` - Test suite

## API Reference

### Functions

- `getValue(key: string): string | null` - Get value by key
- `setValue(key: string, value: string): void` - Set/update value
- `deleteValue(key: string): void` - Delete value by key
- `getAllKeys(): string[]` - Get all storage keys
- `clearAll(): void` - Delete all values

### Hooks

- `useStorageString(key: string, initialValue?: string)` - String value with persistence
- `useStorageNumber(key: string, initialValue?: number)` - Number value with persistence
- `useStorageBoolean(key: string, initialValue?: boolean)` - Boolean value with persistence

All hooks return `[value, setValue]` tuple like `useState`.

## Naming Conventions

Use dot notation for organized keys:

```typescript
// App-level settings
"app.theme"
"app.language"
"app.firstLaunch"

// User preferences
"user.name"
"user.email"
"user.settings.notifications"

// Feature flags
"features.betaMode"
"features.advancedStats"
```

## Testing

Run tests with:

```bash
npm test storage.test.ts
```
