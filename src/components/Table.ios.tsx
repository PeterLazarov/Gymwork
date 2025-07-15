import { ReactNode } from "react"

export type TableProps<T> = {
  moveEnabled: boolean
  deleteEnabled: boolean
  onMove(from: number, to: number): void
  onDelete(i: number): void
  data: T[]
  columns: Array<{
    renderItem: (item: T) => ReactNode
    label: string
    width: string
  }>
}

export function Table() {}
