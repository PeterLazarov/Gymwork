import { measurementUnits } from "@/constants/units"
import { palettes } from "@/designSystem"
import { ExerciseMetric } from "./schema"

export type MetricType = ExerciseMetric["measurement_type"]

export const feelingsEnum = {
  sad: "sad",
  neutral: "neutral",
  happy: "happy",
} as const

export const measurementDefaults = {
  duration: {
    unit: measurementUnits.duration.s,
    moreIsBetter: false,
  },
  reps: {
    unit: measurementUnits.reps.reps,
    moreIsBetter: true,
  },
  weight: {
    unit: measurementUnits.weight.kg,
    moreIsBetter: true,
    step: 2.5,
  },
  distance: {
    unit: measurementUnits.distance.m,
    moreIsBetter: true,
  },
  rest: {
    unit: measurementUnits.duration.s,
    moreIsBetter: false,
  },
  speed: {
    unit: measurementUnits.speed.kph,
    moreIsBetter: true,
  },
} as const

export const measurementTypes = Object.keys(measurementDefaults).sort() as MetricType[]

export const discomfortEnum = {
  pain: "pain",
  discomfort: "discomfort",
  noPain: "noPain",
} as const

// TODO: move from here
export const feelingOptions = {
  sad: {
    icon: "emoji-sad",
    label: "Bad",
    color: palettes.coral.hue600,
    value: "sad",
  },
  neutral: {
    icon: "emoji-happy",
    label: "Good",
    color: palettes.amber.hue600,
    value: "neutral",
  },
  happy: {
    icon: "grin-stars",
    label: "Great",
    color: palettes.green["60"],
    value: "happy",
  },
} as const

export const discomfortOptions = {
  pain: {
    icon: "alert-decagram-outline",
    label: "Severe / Pain",
    color: palettes.coral.hue600,
    value: "pain",
  },
  discomfort: {
    icon: "warning-outline",
    label: "Mild",
    color: palettes.amber.hue600,
    value: "discomfort",
  },
  noPain: {
    icon: "check",
    label: "None",
    color: palettes.green["60"],
    value: "noPain",
  },
} as const
