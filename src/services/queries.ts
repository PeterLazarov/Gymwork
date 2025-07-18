import { SelectSetGroup } from "@/db/sqlite/schema"
import { DrizzleDBType } from "@/db/sqlite/useDB"
import { createQueryKeyStore } from "@lukemorales/query-key-factory"

// A workaround for the fact that SQLite is provided async because of web compat setup
export const queries = {} as ReturnType<typeof generateQueries>

export const generateQueries = (drizzleDB: DrizzleDBType) =>
  createQueryKeyStore({
    setGroups: {
      // all: null,

      detail: (setGroupId: SelectSetGroup["id"]) => ({
        queryKey: [setGroupId],
        queryFn: () =>
          drizzleDB.query.set_groups.findFirst({
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
