import { createContext, useContext } from "react"

import { SelectMuscleArea, SelectEquipment } from "@/db/sqlite/schema"

export const ExerciseSelectContext = createContext<ExerciseSelectContextType | undefined>(undefined)

export const sortTypes = [
  "Name",
  // TODO
  // "Last Performed",
  // "Most Performed"
] as const
export type SortType = (typeof sortTypes)[number]

export const sortDirections = ["ASC", "DESC"] as const
export type SortDirection = (typeof sortDirections)[number]

// Context shared between ExerciseSelect (the parent/header) and SheetContents (list)
interface ExerciseSelectContextType {
  searchOpen: boolean // used in list to accomodate for shift in header size

  // filters
  searchString: null | string
  area: null | SelectMuscleArea["id"]
  equipment: null | SelectEquipment["id"]

  // sorting
  sortType: (typeof sortTypes)[number]
  sortDirection: (typeof sortDirections)[number]
}

export function useExerciseSelectContext() {
  const ctx = useContext(ExerciseSelectContext)
  if (!ctx)
    throw new Error("useExerciseSelectContext must be used within ExerciseSelectContext.Provider")
  return ctx
}
