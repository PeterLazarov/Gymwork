import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useWorkoutFullQuery } from "@/db/queries/useWorkoutFullQuery"
import { capitalize } from "@/utils"
import { DateTime } from "luxon"
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export type OpenedWorkoutContextType = {
  // Date-related
  openedDate: string
  openedDateObject: DateTime
  openedDateMs: number
  openedDateLabel: string
  incrementDate: () => void
  decrementDate: () => void
  setOpenedDate: (newDate: string) => void

  // Workout-related
  openedWorkout: WorkoutModel | null
  openedWorkoutLoading: boolean
}

export const OpenedWorkoutContext = createContext<OpenedWorkoutContextType | null>(null)

export interface OpenedWorkoutProviderProps {}

export const OpenedWorkoutProvider: FC<PropsWithChildren<OpenedWorkoutProviderProps>> = ({
  children,
}) => {
  const [openedDate, setOpenedDate] = useState<string>(today.toISODate())

  const openedDateObject = useMemo(() => DateTime.fromISO(openedDate), [openedDate])

  const todayDiff = useMemo(
    () => Math.round(openedDateObject.diff(today, "days").days),
    [openedDateObject],
  )

  const openedDateMs = useMemo(() => openedDateObject.toMillis(), [openedDateObject])
  const openedDateLabel = useMemo(
    () =>
      Math.abs(todayDiff) < 2
        ? capitalize(openedDateObject.toRelativeCalendar({ unit: "days" })!)
        : openedDateObject.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
    [openedDateObject, todayDiff],
  )

  const { workout, isLoading: openedWorkoutLoading } = useWorkoutFullQuery(openedDateMs)

  const openedWorkout = useMemo(() => (workout ? WorkoutModel.from(workout) : null), [workout])

  const incrementDate = useCallback(() => {
    setOpenedDate(openedDateObject.plus({ days: 1 }).toISODate()!)
  }, [openedDateObject])

  const decrementDate = useCallback(() => {
    setOpenedDate(openedDateObject.minus({ days: 1 }).toISODate()!)
  }, [openedDateObject])

  const value: OpenedWorkoutContextType = {
    openedDate,
    openedDateObject,
    openedDateMs,
    openedDateLabel,
    incrementDate,
    decrementDate,
    setOpenedDate,
    openedWorkout,
    openedWorkoutLoading,
  }

  return <OpenedWorkoutContext.Provider value={value}>{children}</OpenedWorkoutContext.Provider>
}

export const useOpenedWorkout = () => {
  const context = useContext(OpenedWorkoutContext)
  if (!context) throw new Error("useOpenedWorkout must be used within an OpenedWorkoutProvider")
  return context
}
