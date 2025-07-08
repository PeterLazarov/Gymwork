import { createContext, useContext } from "react"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { useSQLiteContext } from "node_modules/expo-sqlite/build/hooks"

import { allRelations } from "@/db/sqlite/relations"
import { schema } from "@/db/sqlite/schema"

export type DrizzleDBType = ReturnType<typeof drizzle<typeof schema & typeof allRelations>>

export const DBContext = createContext<null | {
  sqlite: ReturnType<typeof useSQLiteContext>
  drizzleDB: ReturnType<typeof drizzle<typeof schema & typeof allRelations>>
}>(null)

export function useDB() {
  const ctx = useContext(DBContext)
  if (!ctx) throw new Error("useDBContext must be used within a DBProvider")
  return ctx
}
