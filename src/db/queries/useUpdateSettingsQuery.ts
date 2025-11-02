import { eq } from "drizzle-orm"
import { useCallback } from "react"

import { InsertSettings, settings } from "@/db/schema"
import { useDB } from "@/db/useDB"

export const useUpdateSettingsQuery = () => {
  const { drizzleDB } = useDB()

  return useCallback(
    async (id: number, updates: Partial<InsertSettings>) => {
      await drizzleDB
        .update(settings)
        .set({
          ...updates,
          updated_at: Date.now(),
        })
        .where(eq(settings.id, id))
    },
    [drizzleDB],
  )
}
