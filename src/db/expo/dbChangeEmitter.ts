import { EventEmitter } from "events"
import { addDatabaseChangeListener } from "expo-sqlite"

export type DBChangeEvent = {
  rowId: number
  tableName: string
}

export const dbChangeEmitter = new EventEmitter<{
  update: [rowId: number, tableName: string]
}>()

// Single subscription shared across the app
addDatabaseChangeListener((e) => {
  dbChangeEmitter.emit("update", e.rowId, e.tableName)
})


