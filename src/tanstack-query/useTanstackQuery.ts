import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"

import { dbChangeEmitter } from "@/db/expo/dbChangeEmitter"
import { useDB } from "@/db/useDB"
import { SQLiteBindParams } from "expo-sqlite"

type UseTanstackQueryResult<T> = {
  data: T
  isLoading: boolean
}

export function useTanstackQuery<T>(
  query: string,
  tables?: string[],
  mode?: "multiple" | "single",
): UseTanstackQueryResult<T>

export function useTanstackQuery<T extends { prepare: () => { all: () => unknown } }>(
  query: T,
  tables?: string[],
  mode?: "multiple" | "single",
): UseTanstackQueryResult<Awaited<ReturnType<ReturnType<T["prepare"]>["all"]>>>

export function useTanstackQuery<T extends { all: () => unknown }>(
  query: T,
  tables?: string[],
  mode?: "multiple" | "single",
): UseTanstackQueryResult<Awaited<ReturnType<T["all"]>>>

export function useTanstackQuery(
  query: unknown,
  tables: string[] = [],
  mode: "multiple" | "single" = "multiple",
): UseTanstackQueryResult<unknown> {
  const { sqlite } = useDB()
  const queryClient = useQueryClient()

  const isDrizzleQuery = useMemo(() => {
    return (
      typeof query === "object" && query !== null && typeof (query as any).execute === "function"
    )
  }, [query])

  const key = useMemo(() => {
    // Derive a stable queryKey based on SQL when possible
    if (typeof query === "string") {
      return ["db", "sql", mode, query]
    }
    try {
      const toSQL = (query as any)?.toSQL?.()
      if (toSQL && typeof toSQL.sql === "string") {
        return ["db", isDrizzleQuery ? "drizzle" : "sqlish", mode, toSQL.sql, toSQL.params ?? []]
      }
    } catch {
      // ignore
    }
    // Fallback to object identity as last resort
    return ["db", "object", mode, query]
  }, [query, mode, isDrizzleQuery])

  const queryFn = useMemo(() => {
    return async (): Promise<unknown> => {
      if (isDrizzleQuery) {
        const result = await (query as { execute: () => Promise<unknown> }).execute()
        if (mode === "single") {
          return result ?? null
        }
        return Array.isArray(result) ? result : [result]
      }
      if (typeof query === "string") {
        if (mode === "single") {
          const row = await sqlite.getFirstAsync(query)
          return row ?? null
        }
        return sqlite.getAllAsync(query)
      }
      const toSQL = (query as { toSQL: () => { sql: string; params: unknown[] } }).toSQL()

      if (mode === "single") {
        const row = await sqlite.getFirstAsync(toSQL.sql, toSQL.params as SQLiteBindParams)
        return row ?? null
      }
      return sqlite.getAllAsync(toSQL.sql, toSQL.params as SQLiteBindParams)
    }
  }, [isDrizzleQuery, mode, query, sqlite])

  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn,
  })

  useEffect(() => {
    const listener = (_rowId: number, tableName: string) => {
      if (tables.includes(tableName)) {
        queryClient.invalidateQueries({ queryKey: key }).catch(() => {})
      }
    }
    const sub = dbChangeEmitter.on("update", listener)
    return () => {
      sub.off("update", listener)
    }
  }, [key, queryClient, JSON.stringify(tables)])

  return {
    data,
    isLoading,
  }
}
