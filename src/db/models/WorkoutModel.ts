import type { Exercise, Set, Workout, WorkoutStep, WorkoutStepExercise } from "@/db/schema"
import { Discomfort, Feeling } from "../../constants/enums"
import { WorkoutStepModel } from "./WorkoutStepModel"

type WorkoutModelType = Workout & {
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

  constructor(data: WorkoutModelType) {
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
    const exercises = this.workoutSteps.flatMap(s => s.exercise)

    return Array.from(
      new Set(exercises.flatMap(e => e.muscles))
    ) as string[]
  }

  get muscleAreas(): string[] {
    const exercises = this.workoutSteps.flatMap(s => s.exercise)

    return Array.from(
      new Set(exercises.flatMap(e => e.muscleAreas))
    ) as string[]
  }

  update(updates: Partial<WorkoutModel>): WorkoutModel {
    return Object.assign(this, updates)
  }

  static from(workout: WorkoutModelType): WorkoutModel {
    return new WorkoutModel(workout)
  }
}
