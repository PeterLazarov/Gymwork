import { sqliteTable, text } from "drizzle-orm/sqlite-core"

/**
 * Simple key-value storage table
 */
export const keyValueStorage = sqliteTable("key_value_storage", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
})

export type KeyValueStorage = typeof keyValueStorage.$inferSelect

