import { DateTime, Interval } from 'luxon'

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
