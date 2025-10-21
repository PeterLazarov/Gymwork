import { createContext, FC, PropsWithChildren, useContext, useState } from "react"
import DateTime from "luxon"

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export type OpenedDateContextType = {
  openedDate: string
  openedDateObject: DateTime
  openedDateLabel: string
  incrementDate: () => void
  decrementDate: () => void
  setOpenedDate: (newDate: string) => void
}

export const OpenedDateContext = createContext<OpenedDateContextType | null>(null)

export interface OpenedDateProviderProps {}

export const OpenedDateProvider: FC<PropsWithChildren<OpenedDateProviderProps>> = ({
  children,
}) => {
  const [openedDate, setOpenedDate] = useState<string>(today.toISODate())
  const openedDateObject = DateTime.fromISO(openedDate)
  const todayDiff = Math.round(openedDateObject.diff(today, "days").days)
  const openedDateLabel =
    Math.abs(todayDiff) < 2
      ? openedDateObject.toRelativeCalendar({ unit: "days" })!
      : openedDateObject.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  const value = {
    openedDate,
    openedDateObject,
    openedDateLabel,
    incrementDate: () => {
      setOpenedDate(openedDateObject.plus({ days: 1 }).toISODate())
    },
    decrementDate: () => {
      setOpenedDate(openedDateObject.minus({ days: 1 }).toISODate())
    },
    setOpenedDate,
  }

  return <OpenedDateContext.Provider value={value}>{children}</OpenedDateContext.Provider>
}

export const useOpenedDate = () => {
  const context = useContext(OpenedDateContext)
  if (!context) throw new Error("useEpisodes must be used within an EpisodeProvider")
  return context
}
