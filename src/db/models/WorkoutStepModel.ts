import convert, { Unit } from "convert-units"

import type { Exercise, Set, TargetMetric, WorkoutStep, WorkoutStepExercise, WorkoutStepType } from "@/db/schema"
import { alphabeticNumbering, convertBaseWeightToUnit, getFormatedDuration, translate } from "@/utils"
import { ExerciseModel } from "./ExerciseModel"
import { SetModel } from "./SetModel"

type WorkoutStepModelType = WorkoutStep & {
  workoutStepExercises: (WorkoutStepExercise & {
    exercise: Exercise
  })[]
  sets?: (Set & {
    exercise: Exercise
  })[]
}

export class WorkoutStepModel {
  id: number
  workoutId: number
  stepType: WorkoutStepType
  position: number
  targetMetric: TargetMetric | null
  targetValueBase: number | null
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
    this.targetMetric = data.target_metric ?? null
    this.targetValueBase = data.target_value_base ?? null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.workoutStepExercises = data.workoutStepExercises
    this.exercises = data.workoutStepExercises.map((wse) => ExerciseModel.from(wse.exercise))
    this.sets = data.sets?.map((set) => SetModel.from(set)) ?? []
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

  getTargetCountableSets(manualSetCompletion: boolean): SetModel[] {
    if (!manualSetCompletion) return this.sets
    return this.completedSets
  }

  getTargetDoneBase(manualSetCompletion: boolean): number {
    if (this.stepType !== "target" || !this.targetMetric) return 0
    const countable = this.getTargetCountableSets(manualSetCompletion)

    switch (this.targetMetric) {
      case "reps":
        return countable.reduce((sum, set) => sum + (set.reps ?? 0), 0)
      case "tonnage":
        // Weight-only exercises have no reps; fall back to SUM(weight_mcg).
        if (!this.exercise?.hasMetricType("reps")) {
          return countable.reduce((sum, set) => sum + (set.weightMcg ?? 0), 0)
        }
        return countable.reduce((sum, set) => sum + set.tonnageMcgReps, 0)
      case "distance":
        return countable.reduce((sum, set) => sum + (set.distanceMm ?? 0), 0)
      case "duration":
        return countable.reduce((sum, set) => sum + (set.durationMs ?? 0), 0)
    }
  }

  getTargetRemainingBase(manualSetCompletion: boolean): number {
    return (this.targetValueBase ?? 0) - this.getTargetDoneBase(manualSetCompletion)
  }

  isTargetComplete(manualSetCompletion: boolean): boolean {
    if (this.stepType !== "target" || this.targetValueBase == null || this.targetValueBase <= 0) {
      return false
    }
    return this.getTargetRemainingBase(manualSetCompletion) <= 0
  }

  getTargetUnit(): string {
    switch (this.targetMetric) {
      case "reps":
        return translate("measurements.reps")
      case "tonnage":
        return this.exercise?.getMetricByType("weight")?.unit ?? ""
      case "distance":
        return this.exercise?.getMetricByType("distance")?.unit ?? ""
      case "duration":
        return ""
      default:
        return ""
    }
  }

  getTargetTotalDisplay(): string | number {
    return this.formatTargetBase(this.targetValueBase ?? 0)
  }

  getTargetDoneDisplay(manualSetCompletion: boolean): string | number {
    return this.formatTargetBase(this.getTargetDoneBase(manualSetCompletion))
  }

  getTargetLeftDisplay(manualSetCompletion: boolean): string | number {
    return this.formatTargetBase(Math.max(0, this.getTargetRemainingBase(manualSetCompletion)))
  }

  private formatTargetBase(valueBase: number): string | number {
    switch (this.targetMetric) {
      case "reps":
        return valueBase
      case "tonnage": {
        const unit = this.exercise?.getMetricByType("weight")?.unit
        return unit ? convertBaseWeightToUnit(valueBase, unit) : valueBase
      }
      case "distance": {
        const unit = this.exercise?.getMetricByType("distance")?.unit
        if (!unit) return valueBase
        try {
          return convert(valueBase).from("mm").to(unit as Unit)
        } catch {
          return valueBase
        }
      }
      case "duration": {
        const format = this.exercise?.getMetricByType("duration")?.duration_format
        return getFormatedDuration(valueBase, format)
      }
      default:
        return valueBase
    }
  }

  get hasWarmupSets(): boolean {
    return this.sets.some((set) => set.isWarmup)
  }

  get exercise(): ExerciseModel {
    return this.exercises[0]
  }

  get exerciseSetsMap(): Record<Exercise["id"], SetModel[]> {
    return this.exercises.reduce(
      (acc, exercise) => {
        acc[exercise.id!] = this.getSetsForExercise(exercise.id!)
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
          map[exercise.id!] = alphabeticNumbering(index)
          return map
        },
        {} as Record<Exercise["id"], string>,
      )
    }

    return map
  }

  get setsNumberMap(): Record<Set["id"], number | undefined> {
    const map: Record<Set["id"], number | undefined> = {}
    for (const exercise of this.exercises) {
      let setNumber = 1
      for (const set of this.getSetsForExercise(exercise.id!)) {
        map[set.id!] = set.isWarmup ? undefined : setNumber++
      }
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
