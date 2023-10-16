import { atom } from 'jotai'
import { DateTime } from 'luxon'
import { workoutHistory } from '../data/workoutHistory'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const dateAtom = atom(today)
export const weightUnitAtom = atom('kg')
export const workoutHistoryAtom = atom(workoutHistory)
