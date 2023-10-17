import { atom } from 'jotai'
import { DateTime } from 'luxon'
import { workoutHistory } from '../data/workoutHistory'
import {
  Workout,
  workoutFromSerializable,
  workoutToSerializable,
} from '../types/Workout'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const dateAtom = atom(today)
export const weightUnitAtom = atom('kg')

const _workoutHistoryAtom = atom(workoutHistory)
export const workoutHistoryAtom = atom(
  get => {
    const x = get(_workoutHistoryAtom)
    const y = Object.entries(x)
    const z = y.map(
      ([isoDate, workouts]) =>
        [isoDate, workouts.map(workoutFromSerializable)] as const
    )
    const history = Object.fromEntries(z)
    console.log(history)
    return history
  },
  (get, set, args: Record<string, Workout[]>) => {
    const next = Object.fromEntries(
      Object.entries(args).map(([date, workouts]) => [
        date,
        workouts.map(workoutToSerializable),
      ])
    )
    set(_workoutHistoryAtom, next)
  }
)
