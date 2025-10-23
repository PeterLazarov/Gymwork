import type { Exercise, Set, WorkoutStep, WorkoutStepExercise } from "@/db/schema"
import { ExerciseModel } from "./ExerciseModel"
import { SetModel } from "./SetModel"

type WorkoutStepModelType = WorkoutStep & {
  workoutStepExercises: (WorkoutStepExercise & {
    exercise: Exercise
  })[]
  sets: (Set & {
    exercise: Exercise
  })[]
}

export class WorkoutStepModel {
  declare id: number
  declare workout_id: number
  declare step_type: "plain" | "superset" | "circuit" | "emom" | "amrap" | "custom"
  declare position: number
  declare created_at: number
  declare updated_at: number
  declare workoutStepExercises: WorkoutStepModelType["workoutStepExercises"]
  exercises: ExerciseModel[]
  sets: SetModel[]

  constructor(data: WorkoutStepModelType) {
    Object.assign(this, data)
    this.exercises = data.workoutStepExercises.map((wse) => ExerciseModel.from(wse.exercise))
    this.sets = data.sets.map((set) => SetModel.from(set))
  }

  get isPlain(): boolean {
    return this.step_type === "plain"
  }

  get isSuperset(): boolean {
    return this.step_type === "superset"
  }

  get isCircuit(): boolean {
    return this.step_type === "circuit"
  }

  get isEmom(): boolean {
    return this.step_type === "emom"
  }

  get isAmrap(): boolean {
    return this.step_type === "amrap"
  }

  get isCustom(): boolean {
    return this.step_type === "custom"
  }

  get completedSets(): SetModel[] {
    return this.sets.filter((set) => set.isComplete)
  }

  get incompleteSets(): SetModel[] {
    return this.sets.filter((set) => set.isIncomplete)
  }

  get isComplete(): boolean {
    return this.sets.length > 0 && this.incompleteSets.length === 0
  }

  get hasWarmupSets(): boolean {
    return this.sets.some((set) => set.is_warmup)
  }

  getSetsForExercise(exerciseId: number): SetModel[] {
    return this.sets.filter((set) => set.exercise_id === exerciseId)
  }

  getCompletedSetsForExercise(exerciseId: number): SetModel[] {
    return this.completedSets.filter((set) => set.exercise_id === exerciseId)
  }

  static from(workoutStep: WorkoutStepModelType): WorkoutStepModel {
    return new WorkoutStepModel(workoutStep)
  }
}
