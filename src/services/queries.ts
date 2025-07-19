import { getDrizzle } from "@/components/Providers/DrizzleProvider"
import { SelectSet, SelectSetGroup, sets } from "@/db/sqlite/schema"
import { createQueryKeyStore } from "@lukemorales/query-key-factory"
import { eq } from "drizzle-orm"

// A workaround for the fact that SQLite is provided async because of web compat setup
export const queries = createQueryKeyStore({
  setGroups: {
    // all: null,

    detail: (setGroupId: SelectSetGroup["id"]) => ({
      queryKey: [setGroupId],
      queryFn: () =>
        getDrizzle().query.set_groups.findFirst({
          where(fields, operators) {
            return operators.eq(fields.id, setGroupId)
          },
          with: {
            sets: {
              with: {
                exercise: {
                  columns: {
                    name: true,
                  },
                  with: {
                    exerciseMetrics: {
                      with: {
                        metric: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
    }),
  },
})
