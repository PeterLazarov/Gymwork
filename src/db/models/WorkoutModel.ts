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
  declare id: number
  declare name: string | null
  declare notes: string | null
  declare date: number | null
  declare feeling: string | null
  declare pain: string | null
  declare rpe: number | null
  declare ended_at: number | null
  declare duration_ms: number | null
  declare is_template: boolean
  declare created_at: number
  declare updated_at: number
  workoutSteps: WorkoutStepModel[]

  constructor(data: WorkoutModelType) {
    Object.assign(this, data)
    this.workoutSteps = data.workoutSteps.map((step) => WorkoutStepModel.from(step))
  }

  get hasComments(): boolean {
    return !!(this.notes || this.feeling || this.pain || this.rpe)
  }

  get isComplete(): boolean {
    return this.ended_at !== null
  }

  get duration(): number | null {
    return this.duration_ms
  }

  get hasIncompleteSets(): boolean {
    return this.workoutSteps.some((step) => step.incompleteSets.length > 0)
  }

  static from(workout: WorkoutModelType): WorkoutModel {
    return new WorkoutModel(workout)
  }
}
