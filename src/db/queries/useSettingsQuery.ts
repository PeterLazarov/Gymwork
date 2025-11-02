import { useEffect, useMemo, useState } from "react"

import { useExpoQuery } from "@/db/expo/useExpoQuery"
import { InsertSettings, Settings, settings } from "@/db/schema"
import { useDB } from "@/db/useDB"

const EMPTY_DEFAULTS: Partial<InsertSettings> = {}

type UseSettingsQueryResult = {
  settings: Settings | null
  isLoading: boolean
}

export const useSettingsQuery = (
  defaults: Partial<InsertSettings> = EMPTY_DEFAULTS,
): UseSettingsQueryResult => {
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
  const rawResult = useExpoQuery(query, ["settings"], "single") as
    | Settings
    | null
    | undefined
    | any[]

  const settingsRow = Array.isArray(rawResult)
    ? ((rawResult[0] ?? null) as Settings | null)
    : ((rawResult ?? null) as Settings | null)

  return {
    settings: settingsRow,
    isLoading: !isEnsured || rawResult === undefined,
  }
}
