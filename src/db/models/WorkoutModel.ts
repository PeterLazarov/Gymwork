import type { Exercise, Set, Workout, WorkoutStep, WorkoutStepExercise } from "@/db/schema"
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

export class WorkoutModel {
  id: number
  name: string | null
  notes: string | null
  date: number | null
  feeling: string | null
  pain: string | null
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
    this.feeling = data.feeling
    this.pain = data.pain
    this.rpe = data.rpe
    this.endedAt = data.ended_at
    this.durationMs = data.duration_ms
    this.isTemplate = data.is_template
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.workoutSteps = data.workoutSteps.map((step) => WorkoutStepModel.from(step))
  }

  get hasComments(): boolean {
    return !!(this.notes || this.feeling || this.pain || this.rpe)
  }

  get isComplete(): boolean {
    return this.endedAt !== null
  }

  get hasIncompleteSets(): boolean {
    return this.workoutSteps.some((step) => step.incompleteSets.length > 0)
  }

  static from(workout: WorkoutModelType): WorkoutModel {
    return new WorkoutModel(workout)
  }
}
