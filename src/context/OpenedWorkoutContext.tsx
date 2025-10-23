import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useWorkoutFullQuery } from "@/db/queries/useWorkoutFullQuery"
import { useDB } from "@/db/useDB"
import { DateTime } from "luxon"
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react"

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export type OpenedWorkoutContextType = {
  // Date-related
  openedDate: string
  openedDateObject: DateTime
  openedDateLabel: string
  incrementDate: () => void
  decrementDate: () => void
  setOpenedDate: (newDate: string) => void

  // Workout-related
  openedWorkout: WorkoutModel | null
  isLoadingWorkout: boolean
  refetchWorkout: () => Promise<void>
}

export const OpenedWorkoutContext = createContext<OpenedWorkoutContextType | null>(null)

export interface OpenedWorkoutProviderProps {}

export const OpenedWorkoutProvider: FC<PropsWithChildren<OpenedWorkoutProviderProps>> = ({
  children,
}) => {
  const { drizzleDB } = useDB()
  const [openedDate, setOpenedDate] = useState<string>(today.toISODate())
  const [openedWorkout, setOpenedWorkout] = useState<WorkoutModel | null>(null)
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true)

  const openedDateObject = DateTime.fromISO(openedDate)
  const todayDiff = Math.round(openedDateObject.diff(today, "days").days)
  const openedDateLabel =
    Math.abs(todayDiff) < 2
      ? openedDateObject.toRelativeCalendar({ unit: "days" })!
      : openedDateObject.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  const workoutQuery = useWorkoutFullQuery(openedDateObject.toMillis())

  const fetchWorkout = async () => {
    setIsLoadingWorkout(true)
    try {
      const result = await workoutQuery()
      if (result) {
        setOpenedWorkout(WorkoutModel.from(result))
      } else {
        setOpenedWorkout(null)
      }
    } catch (error) {
      console.error("Error fetching workout:", error)
      setOpenedWorkout(null)
    } finally {
      setIsLoadingWorkout(false)
    }
  }

  useEffect(() => {
    fetchWorkout()
  }, [openedDate, drizzleDB])

  const value: OpenedWorkoutContextType = {
    openedDate,
    openedDateObject,
    openedDateLabel,
    incrementDate: () => {
      setOpenedDate(openedDateObject.plus({ days: 1 }).toISODate()!)
    },
    decrementDate: () => {
      setOpenedDate(openedDateObject.minus({ days: 1 }).toISODate()!)
    },
    setOpenedDate,
    openedWorkout,
    isLoadingWorkout,
    refetchWorkout: fetchWorkout,
  }

  return <OpenedWorkoutContext.Provider value={value}>{children}</OpenedWorkoutContext.Provider>
}

export const useOpenedWorkout = () => {
  const context = useContext(OpenedWorkoutContext)
  if (!context) throw new Error("useOpenedWorkout must be used within an OpenedWorkoutProvider")
  return context
}
