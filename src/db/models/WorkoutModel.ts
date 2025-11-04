import type { Exercise, Set, Workout, WorkoutStep, WorkoutStepExercise } from "@/db/schema"
import { Discomfort, Feeling } from "../../constants/enums"
import { WorkoutStepModel } from "./WorkoutStepModel"

export type WorkoutModelRecord = Workout & {
  workoutSteps: (WorkoutStep & {
    workoutStepExercises: (WorkoutStepExercise & {
      exercise: Exercise
    })[]
    sets: (Set & {
      exercise: Exercise
    })[]
  })[]
}

export type WorkoutComments = {
  name?: string
  notes: string
  feeling?: Feeling
  pain?: Discomfort
  rpe?: number
}

export class WorkoutModel {
  id: number
  name: string | null
  notes: string | null
  date: number | null
  feeling: Feeling | null
  pain: Discomfort | null
  rpe: number | null
  endedAt: number | null
  durationMs: number | null
  isTemplate: boolean
  createdAt: number
  updatedAt: number
  workoutSteps: WorkoutStepModel[]
  private readonly musclesCache: string[]
  private readonly muscleAreasCache: string[]

  constructor(data: WorkoutModelRecord) {
    this.id = data.id
    this.name = data.name
    this.notes = data.notes
    this.date = data.date
    this.feeling = data.feeling as Feeling | null
    this.pain = data.pain as Discomfort | null
    this.rpe = data.rpe
    this.endedAt = data.ended_at
    this.durationMs = data.duration_ms
    this.isTemplate = data.is_template
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.workoutSteps = data.workoutSteps?.map((step) => WorkoutStepModel.from(step)) ?? []

    const exercises = this.workoutSteps.flatMap((step) => step.exercises)
    const uniqueMuscles = new Set<string>()
    const uniqueMuscleAreas = new Set<string>()

    exercises.forEach((exercise) => {
      exercise.muscles.forEach((muscle) => uniqueMuscles.add(muscle))
      exercise.muscleAreas.forEach((muscleArea) => uniqueMuscleAreas.add(muscleArea))
    })

    this.musclesCache = Object.freeze(Array.from(uniqueMuscles)) as string[]
    this.muscleAreasCache = Object.freeze(Array.from(uniqueMuscleAreas)) as string[]
  }

  get hasComments(): boolean {
    return !!(this.name || this.notes || this.feeling || this.pain || this.rpe)
  }

  get isComplete(): boolean {
    return this.endedAt !== null
  }

  get hasIncompleteSets(): boolean {
    return this.workoutSteps.some((step) => step.incompleteSets.length > 0)
  }

  get comments(): WorkoutComments {
    return {
      name: this.name ?? undefined,
      notes: this.notes ?? "",
      feeling: this.feeling ?? undefined,
      pain: this.pain ?? undefined,
      rpe: this.rpe ?? undefined,
    }
  }

  get muscles(): string[] {
    return this.musclesCache
  }

  get muscleAreas(): string[] {
    return this.muscleAreasCache
  }

  update(updates: Partial<WorkoutModel>): WorkoutModel {
    return Object.assign(this, updates)
  }

  static from(workout: WorkoutModelRecord): WorkoutModel {
    return new WorkoutModel(workout)
  }
}
