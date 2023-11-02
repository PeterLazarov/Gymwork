import { atom } from 'jotai'
import { DateTime } from 'luxon'

import { WorkoutExercise } from '../models/WorkoutExercise'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const dateAtom = atom(today)
export const weightUnitAtom = atom('kg')
export const openedWorkoutExerciseAtom = atom<WorkoutExercise | null>(null)
