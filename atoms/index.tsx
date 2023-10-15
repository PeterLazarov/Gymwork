import { atom } from 'jotai'
import { DateTime } from 'luxon'

const now = DateTime.now()
const today = now.set({ hour: 0, minute: 0, second: 0 })

export const dateAtom = atom(today)
