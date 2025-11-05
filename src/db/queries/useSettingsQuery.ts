import { useEffect, useMemo, useState } from "react"

import { useExpoQuery } from "@/db/expo/useExpoQuery"
import { InsertSettings, settings } from "@/db/schema"
import { useDB } from "@/db/useDB"

const EMPTY_DEFAULTS: Partial<InsertSettings> = {}

export const useSettingsQuery = (defaults: Partial<InsertSettings> = EMPTY_DEFAULTS) => {
  const { drizzleDB } = useDB()
  const [isEnsured, setIsEnsured] = useState(false)

  useEffect(() => {
    let isMounted = true

    const ensureSettingsRow = async () => {
      try {
        const rows = await drizzleDB.select().from(settings).limit(1)
        if (!isMounted) return

        if (rows.length === 0) {
          await drizzleDB.insert(settings).values(defaults).run()
        }
      } finally {
        if (isMounted) {
          setIsEnsured(true)
        }
      }
    }

    void ensureSettingsRow()

    return () => {
      isMounted = false
    }
  }, [drizzleDB, JSON.stringify(defaults)])

  const query = useMemo(() => drizzleDB.query.settings.findFirst(), [drizzleDB])
  const { data, isLoading: queryLoading } = useExpoQuery(query, ["settings"], "single")

  return {
    settings: data,
    isLoading: !isEnsured || queryLoading,
  }
}
