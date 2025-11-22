import { drizzle } from "drizzle-orm/expo-sqlite"
import { createContext, useContext } from "react"

import { allRelations } from "@/db/relations"
import { schema } from "@/db/schema"
import { DatabaseService } from "./services/DatabaseService"

export type DrizzleDBType = ReturnType<typeof drizzle<typeof schema & typeof allRelations>>

export const DatabaseServiceContext = createContext<DatabaseService | null>(null)

export function useDatabaseService() {
  const service = useContext(DatabaseServiceContext)
  if (!service) {
    throw new Error("useDatabaseService must be used within a DatabaseProvider")
  }
  return service
}
