import { useEffect, useMemo, useRef, useState } from "react"
import { addDatabaseChangeListener } from "expo-sqlite"
import { EventEmitter } from "events"

import { useDB } from "@/db/useDB"

const emitter = new EventEmitter<{
  update: [rowId: number, table: string]
}>()

addDatabaseChangeListener((e) => {
  console.warn(`Hook has been called`, e)
  emitter.emit("update", e.rowId, e.tableName)
})
const defaultTables: string[] = []

export function useExpoQuery<T>(query: string, tables?: string[]): T

export function useExpoQuery<T extends { prepare: () => { all: () => any } }>(
  query: T,
  tables?: string[],
): Awaited<ReturnType<ReturnType<T["prepare"]>["all"]>>

export function useExpoQuery<T extends { all: () => any }>(
  query: T,
  tables?: string[],
): Awaited<ReturnType<T["all"]>>

/**
 * Allows subscribing to any SQL query
 * @param query A complete SQL string with the params included, or a Drizzle select/query (.toSQL)
 * @param tables String array with the table names such as ["sets"]
 */
export function useExpoQuery(query: any, tables: string[] = defaultTables): any[] {
  const [data, setData] = useState<any[]>([])
  const latestReq = useRef(0)
  const isActive = useRef(true)
  const { sqlite } = useDB()

  // Memoize SQL + params to avoid recalculating on each render
  const { sql, params } = useMemo(() => {
    if (typeof query === "string") return { sql: query, params: [] }
    const toSQL = query.toSQL()
    return { sql: toSQL.sql, params: toSQL.params }
  }, [query])

  useEffect(() => {
    isActive.current = true
    const reqId = ++latestReq.current

    const fetchRows = () => {
      sqlite
        .getAllAsync(sql, params)
        .then((rows) => {
          if (isActive.current && reqId === latestReq.current) {
            setData(rows)
          }
        })
        .catch((err) => {
          if (isActive.current) console.error("Query error:", err)
        })
    }

    fetchRows()

    const listener = (_rowId: number, table: string) => {
      if (tables.includes(table)) fetchRows()
    }
    const sub = emitter.on("update", listener)

    return () => {
      isActive.current = false
      sub.off("update", listener)
    }
  }, [sql, JSON.stringify(params), JSON.stringify(tables)])

  return data
}
