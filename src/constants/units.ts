export const measurementUnits = {
  duration: {
    ms: "ms",
    s: "s",
    m: "m",
    h: "h",
  },
  weight: {
    kg: "kg",
    lb: "lb",
  },
  distance: { cm: "cm", m: "m", km: "km", ft: "ft", mile: "mi" },
  rest: {
    ms: "ms",
    s: "s",
    m: "m",
    h: "h",
  },
  reps: {
    reps: "reps",
  },
  speed: {
    kph: "km/h",
    mph: "m/h",
  },
} as const

export type DistanceUnit =
  (typeof measurementUnits.distance)[keyof typeof measurementUnits.distance]

export type WeightUnit = (typeof measurementUnits.weight)[keyof typeof measurementUnits.weight]

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
}
