import { queryClient } from "@/components/Providers/TanstackQueryProvider"
import { SelectSet, sets } from "@/db/sqlite/schema"
import { useMutation } from "@tanstack/react-query"
import { eq } from "drizzle-orm"
import { queries } from "./queries"
import { getDrizzle } from "@/components/Providers/DrizzleProvider"

export const useToggleSet = () => {
  return useMutation({
    mutationFn: (item: SelectSet) => {
      return getDrizzle()
        .update(sets)
        .set({ completed_at: item.completed_at ? null : Date.now() })
        .where(eq(sets.id, item.id))
        .execute()
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({
        queryKey: queries.setGroups.detail(variables.set_group_id).queryKey,
      })
    },
  })
}
