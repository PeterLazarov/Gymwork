import type { Exercise, Set, WorkoutStep, WorkoutStepExercise } from "@/db/schema"
import { alphabeticNumbering } from "@/utils"
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
  id: number
  workoutId: number
  stepType: "plain" | "superset" | "circuit" | "emom" | "amrap" | "custom"
  position: number
  createdAt: number
  updatedAt: number
  workoutStepExercises: WorkoutStepModelType["workoutStepExercises"]
  exercises: ExerciseModel[]
  sets: SetModel[]

  constructor(data: WorkoutStepModelType) {
    this.id = data.id
    this.workoutId = data.workout_id
    this.stepType = data.step_type
    this.position = data.position
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.workoutStepExercises = data.workoutStepExercises
    this.exercises = data.workoutStepExercises.map((wse) => ExerciseModel.from(wse.exercise))
    this.sets = data.sets.map((set) => SetModel.from(set))
  }

  get isPlain(): boolean {
    return this.stepType === "plain"
  }

  get isSuperset(): boolean {
    return this.stepType === "superset"
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
    return this.sets.some((set) => set.isWarmup)
  }

  get exerciseSetsMap(): Record<Exercise["id"], SetModel[]> {
    return this.exercises.reduce(
      (acc, exercise) => {
        acc[exercise.id] = this.getSetsForExercise(exercise.id)
        return acc
      },
      {} as Record<Exercise["id"], SetModel[]>,
    )
  }

  get exerciseLettering(): Record<Exercise["id"], string> {
    let map: Record<Exercise["id"], string> = {}

    if (this.stepType === "superset") {
      map = this.exercises.reduce(
        (map, exercise, index) => {
          map[exercise.id] = alphabeticNumbering(index)
          return map
        },
        {} as Record<Exercise["id"], string>,
      )
    }

    return map
  }

  getSetsForExercise(exerciseId: number): SetModel[] {
    return this.sets.filter((set) => set.exerciseId === exerciseId)
  }

  getCompletedSetsForExercise(exerciseId: number): SetModel[] {
    return this.completedSets.filter((set) => set.exerciseId === exerciseId)
  }

  static from(workoutStep: WorkoutStepModelType): WorkoutStepModel {
    return new WorkoutStepModel(workoutStep)
  }
}
