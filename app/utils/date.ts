import { DateTime, Interval } from 'luxon'
import { capitalize } from './string'

export const getDateRange = (from: string, to: string) => {
  const range = [from, to] as const

  const interval = Interval.fromDateTimes(
    DateTime.fromISO(from),
    DateTime.fromISO(to)
  )

  const result = interval
    .splitBy({ days: 1 })
    .map(d => d.start!.toISODate()!)
    .concat(range[1])

  return result
}

const dateFormats = {
  short: 'MMM dd',
  long: 'ccc, MMM dd, yyyy'
}

export const formatDateIso = (dateIso: string, format: keyof typeof dateFormats) => {
  const date = DateTime.fromISO(dateIso)

  return formatDate(date, format)
}
export const formatDate = (date: DateTime, format: keyof typeof dateFormats) => {
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(date.diff(today, 'days').days)
  const dateLabel =
    Math.abs(todayDiff) < 2
      ? capitalize(date.toRelativeCalendar({ unit: 'days' })!)
      : date.toFormat(dateFormats[format])

  return dateLabel
}
