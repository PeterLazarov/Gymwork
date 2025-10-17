# Storage Implementation

This directory contains the storage implementation for the app, using **expo-sqlite** with **Drizzle ORM**.

## Overview

The storage system provides a simple key-value store backed by SQLite. It includes:

- **Database Layer** (`db.ts`): Database operations using Drizzle ORM
- **Schema** (`schema.ts`): Database schema definition
- **React Hooks** (`hooks.ts`): React hooks for persistent state management
- **Tests** (`storage.test.ts`): Comprehensive test suite
- **Main Export** (`index.ts`): Convenient re-exports

## Usage

### Direct Storage Operations

```typescript
import { getValue, setValue, deleteValue, clearAll, getAllKeys } from "@/utils/storage"

// Save and load strings
setValue("key", "value")
const value = getValue("key") // "value"

// Save and load objects (JSON serialize/deserialize yourself)
setValue("user", JSON.stringify({ name: "John", age: 30 }))
const user = JSON.parse(getValue("user")!) // { name: "John", age: 30 }

// Delete a key
deleteValue("key")

// Get all keys
const keys = getAllKeys()

// Clear all data
clearAll()
```

### React Hooks (Recommended)

For stateful components, use the provided hooks:

```typescript
import { useStorageString, useStorageNumber, useStorageBoolean } from "@/utils/storage"

function MyComponent() {
  // String values
  const [name, setName] = useStorageString("user.name")

  // Number values
  const [age, setAge] = useStorageNumber("user.age")

  // Boolean values
  const [isActive, setIsActive] = useStorageBoolean("user.active")

  return (
    <View>
      <Text>{name}</Text>
      <Button onPress={() => setName("New Name")} />
    </View>
  )
}
```

### Advanced: Direct Database Access

For complex queries, use Drizzle ORM directly:

```typescript
import { db, schema } from "@/utils/storage"
import { eq, like } from "drizzle-orm"

// Query the database
const results = db
  .select()
  .from(schema.keyValueStorage)
  .where(like(schema.keyValueStorage.key, "user.%"))
  .all()

// Get specific keys
const userKeys = db
  .select()
  .from(schema.keyValueStorage)
  .where(eq(schema.keyValueStorage.key, "user.name"))
  .get()
```

## Database Schema

The storage uses a simple key-value table:

```sql
CREATE TABLE key_value_storage (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
```

## Extending the Schema

To add more tables or complex data structures:

1. Add new table definitions to `schema.ts`
2. Update `db.ts` to include initialization logic
3. Create new functions for querying the new tables
4. Export them from `index.ts` or create separate modules

Example:

```typescript
// schema.ts
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
})

// db.ts
export function initializeDatabase() {
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS key_value_storage (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `)
}
```

## API

### Core Functions

- `getValue(key: string): string | null` - Get a value by key
- `setValue(key: string, value: string): void` - Set a value by key
- `deleteValue(key: string): void` - Delete a value by key
- `getAllKeys(): string[]` - Get all keys in storage
- `clearAll(): void` - Clear all data from storage

### React Hooks

- `useStorageString(key: string, initialValue?: string)` - Hook for string values
- `useStorageNumber(key: string, initialValue?: number)` - Hook for number values
- `useStorageBoolean(key: string, initialValue?: boolean)` - Hook for boolean values

All hooks return a tuple `[value, setValue]` similar to `useState`.

## Benefits of SQLite + Drizzle

- ✅ Type-safe queries with Drizzle ORM
- ✅ Support for complex queries and relationships
- ✅ Better debugging and data inspection
- ✅ Native to Expo (no additional native modules)
- ✅ Supports migrations for schema changes
- ✅ More performant for complex data structures

## Drizzle Kit

Drizzle Kit is included as a dev dependency. You can use it to generate migrations:

```bash
# Generate migrations
npx drizzle-kit generate:sqlite

# Push schema changes
npx drizzle-kit push:sqlite
```

See `drizzle.config.ts` in the project root for configuration.

## Testing

Run the storage tests:

```bash
npm test -- storage.test.ts
```

The tests ensure all storage operations work correctly and data persists between operations.

## Migration from MMKV

If you're migrating from MMKV:

| Old MMKV API | New API |
|--------------|---------|
| `useMMKVString(key)` | `useStorageString(key)` |
| `storage.getString(key)` | `getValue(key)` |
| `storage.set(key, value)` | `setValue(key, value)` |
| `storage.delete(key)` | `deleteValue(key)` |
| `storage.clearAll()` | `clearAll()` |
| `storage.getAllKeys()` | `getAllKeys()` |

The main difference is that the new API is function-based rather than object-based, and all functions are directly imported from `@/utils/storage`.

