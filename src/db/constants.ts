export const METRICS = ["weight_mcg", "reps", "duration_ms", "distance_mm", "rest_ms"] as const
export const WEIGHT_UNITS = ["g", "kg", "lb"] as const
export const DURATION_UNITS = ["s", "m", "h"] as const
export const DISTANCE_UNITS = ["cm", "m", "km"] as const
export type UNIT =
  | (typeof WEIGHT_UNITS)[number]
  | (typeof DURATION_UNITS)[number]
  | (typeof DISTANCE_UNITS)[number]
  | "count"
export const ALL_UNITS = [...WEIGHT_UNITS, ...DURATION_UNITS, ...DISTANCE_UNITS, "count"] as const

// SQLite config
export const SQLiteDBName = "db.db"
