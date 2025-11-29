import { Duration } from 'luxon'

export const getFormatedDuration = (
  milliseconds: number,
  hideHours?: boolean
) => {
  const duration = Duration.fromObject({ milliseconds })

  const format = hideHours ? 'mm:ss' : 'hh:mm:ss'
  const formattedTime = duration.toFormat(format)

  return formattedTime
}
