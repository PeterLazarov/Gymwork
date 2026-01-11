import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { InsertSettings } from "../schema"
import { schema } from "../schema"
import { useDatabaseService } from "../useDB"

export const defaultSettings: InsertSettings = {
  theme: "light",
  scientific_muscle_names_enabled: false,
  manual_set_completion: false,
  preview_next_set: false,
  measure_rest: false,
  show_comments_card: false,
  show_workout_timer: false,
  visited_welcome_screen: false,
  feedback_user: "",
}

export function useSettings() {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const settings = await db.getSettings()

      if (!settings) {
        const drizzle = db.getDrizzle()
        const result = await drizzle.insert(schema.settings).values(defaultSettings).returning()

        return result[0]
      }

      return settings
    },
    meta: { op: "settings.get" },
    staleTime: Infinity,
  })
}

export function useUpdateSettings() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "settings.update" },
    mutationFn: ({ id, updates }: { id: number; updates: Partial<InsertSettings> }) =>
      db.updateSettings(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
