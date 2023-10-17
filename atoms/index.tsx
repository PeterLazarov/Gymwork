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
  get => get(_workoutHistoryAtom).map(workoutFromSerializable),
  (get, set, args: Workout[]) => {
    set(_workoutHistoryAtom, args.map(workoutToSerializable))
  }
)
