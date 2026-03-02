import { Duration } from "luxon"

import { durationFormats } from "@/constants/enums"
import { ExerciseMetric } from "@/db/schema"

export type DurationFormat = ExerciseMetric["duration_format"]

export const getFormatedDuration = (
  milliseconds: number,
  format: DurationFormat = durationFormats.mm_ss,
) => {
  const duration = Duration.fromObject({ milliseconds }).shiftTo("hours", "minutes", "seconds")
  const { hours, minutes, seconds } = duration.toObject()

  switch (format) {
    case durationFormats.ss:
      return `${Math.round(duration.as("seconds"))}s`
    case durationFormats.mm:
      return `${Math.round(duration.as("minutes"))}m`
    case durationFormats.mm_ss:
      return `${minutes ?? 0}m${String(Math.round(seconds ?? 0)).padStart(2, "0")}s`
    case durationFormats.hh_mm_ss:
      return `${hours ?? 0}h${String(minutes ?? 0).padStart(2, "0")}m${String(Math.round(seconds ?? 0)).padStart(2, "0")}s`
  }
}
