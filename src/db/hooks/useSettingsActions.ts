import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { InsertSettings } from "../schema"
import { useDatabaseService } from "../useDB"

export function useSettings() {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["settings"],
    queryFn: () => db.getSettings(),
  })
}

export function useUpdateSettings() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<InsertSettings> }) =>
      db.updateSettings(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
