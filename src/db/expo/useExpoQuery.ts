import { useEffect, useMemo, useRef, useState } from "react"

import { useDB } from "@/db/useDB"
import { dbChangeEmitter } from "@/db/expo/dbChangeEmitter"

const defaultTables: string[] = []

type UseExpoQueryResult<T> = {
  data: T
  isLoading: boolean
}

export function useExpoQuery<T>(
  query: string,
  tables?: string[],
  mode?: "multiple" | "single",
): UseExpoQueryResult<T>

export function useExpoQuery<T extends { prepare: () => { all: () => unknown } }>(
  query: T,
  tables?: string[],
  mode?: "multiple" | "single",
): UseExpoQueryResult<Awaited<ReturnType<ReturnType<T["prepare"]>["all"]>>>

export function useExpoQuery<T extends { all: () => unknown }>(
  query: T,
  tables?: string[],
  mode?: "multiple" | "single",
): UseExpoQueryResult<Awaited<ReturnType<T["all"]>>>

/**
 * Allows subscribing to any SQL query
 * @param query A complete SQL string with the params included, or a Drizzle select/query (.toSQL)
 * @param tables String array with the table names such as ["sets"]
 * @param mode Whether to fetch all rows ('multiple', default) or just the first row ('single')
 */
export function useExpoQuery(
  query: any,
  tables: string[] = defaultTables,
  mode: "multiple" | "single" = "multiple",
): UseExpoQueryResult<unknown> {
  const [data, setData] = useState<unknown>(mode === "single" ? undefined : [])
  const [isLoading, setIsLoading] = useState(true)
  const latestReq = useRef(0)
  const isActive = useRef(true)
  const { sqlite } = useDB()

  const isDrizzleQuery = useMemo(() => {
    return typeof query === "object" && query !== null && typeof query.execute === "function"
  }, [query])

  const { sql, params } = useMemo(() => {
    if (isDrizzleQuery) return { sql: null, params: [] }
    if (typeof query === "string") return { sql: query, params: [] }
    const toSQL = query.toSQL()
    return { sql: toSQL.sql, params: toSQL.params }
  }, [query, isDrizzleQuery])

  useEffect(() => {
    isActive.current = true
    const reqId = ++latestReq.current

    const fetchRows = () => {
      setIsLoading(true)
      let fetchPromise: Promise<any>

      if (isDrizzleQuery) {
        fetchPromise = query.execute().then((result: any) => {
          if (mode === "single") {
            return result
          }
          return Array.isArray(result) ? result : [result]
        })
      } else {
        fetchPromise =
          mode === "single" ? sqlite.getFirstAsync(sql!, params) : sqlite.getAllAsync(sql!, params)
      }

      fetchPromise
        .then((rows) => {
          if (isActive.current && reqId === latestReq.current) {
            setData(rows)
          }
        })
        .catch((err) => {
          if (isActive.current) console.error("Query error:", err)
        })
        .finally(() => {
          if (isActive.current && reqId === latestReq.current) {
            setIsLoading(false)
          }
        })
    }

    fetchRows()

    const listener = (_rowId: number, table: string) => {
      if (tables.includes(table)) fetchRows()
    }
    const sub = dbChangeEmitter.on("update", listener)

    return () => {
      isActive.current = false
      sub.off("update", listener)
    }
  }, [query, sql, JSON.stringify(params), JSON.stringify(tables), mode, isDrizzleQuery])

  return useMemo(
    () => ({
      data,
      isLoading,
    }),
    [data, isLoading],
  )
}
