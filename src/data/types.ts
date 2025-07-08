import type state from "./GymWork_state.json"

export type Exercise = (typeof state)["exerciseStore"]["exercises"][number]
export type Workout = (typeof state)["workoutStore"]["workouts"][number]
export type WorkoutStep = (typeof state)["workoutStore"]["workouts"][number]["steps"][number]
export type WorkoutSet =
  (typeof state)["workoutStore"]["workouts"][number]["steps"][number]["sets"][number]
export type Record = (typeof state)["recordStore"]["records"][number]
