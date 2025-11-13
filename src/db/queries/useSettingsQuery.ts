import { useEffect, useMemo, useState } from "react"

import { InsertSettings, settings } from "@/db/schema"
import { useDB } from "@/db/useDB"
import { useTanstackQuery } from "@/tanstack-query"
import { Appearance } from "react-native"

let deviceColorScheme = Appearance.getColorScheme()
Appearance.addChangeListener(({ colorScheme }) => {
  deviceColorScheme = colorScheme
})


export const useSettingsQuery = () => {
  const { drizzleDB } = useDB()
  const [isEnsured, setIsEnsured] = useState(false)

  useEffect(() => {
    let isMounted = true

    const ensureSettingsRow = async () => {
      try {
        const rows = await drizzleDB.select().from(settings).limit(1)
        if (!isMounted) return

        if (rows.length === 0) {
          const defaults: InsertSettings = {
            show_comments_card: false,
            manual_set_completion: false,
            show_workout_timer: false,
            scientific_muscle_names_enabled: false,
            measure_rest: false,
            preview_next_set: false,
            visited_welcome_screen: false,
            feedback_user: '',
            theme: deviceColorScheme ?? 'light'
          }

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
  }, [drizzleDB])

  const query = useMemo(() => drizzleDB.query.settings.findFirst(), [drizzleDB])
  const { data, isLoading: queryLoading } = useTanstackQuery(query, ["settings"], "single")

  return {
    settings: data,
    isLoading: !isEnsured || queryLoading,
  }
}
