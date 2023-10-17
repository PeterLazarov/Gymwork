import type { exercises } from '../data/exercises.json'

export type Exercise = (typeof exercises)[number]
