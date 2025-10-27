import type { Exercise, Set } from "@/db/schema"
import convert, { Unit } from "convert-units"
import { ExerciseModel } from "./ExerciseModel"

type SetModelType = Set & {
  exercise?: Exercise
}

export class SetModel {
  id: number
  workoutStepId: number
  exerciseId: number
  isWarmup: boolean
  date: number
  isWeakAssRecord: boolean
  reps: number | null
  weightMcg: number | null
  distanceMm: number | null
  durationMs: number | null
  speedKph: number | null
  restMs: number | null
  completedAt: number | null
  createdAt: number
  updatedAt: number
  exercise: ExerciseModel

  constructor(data: SetModelType) {
    this.id = data.id
    this.workoutStepId = data.workout_step_id
    this.exerciseId = data.exercise_id
    this.isWarmup = data.is_warmup
    this.date = data.date
    this.isWeakAssRecord = data.is_weak_ass_record
    this.reps = data.reps
    this.weightMcg = data.weight_mcg
    this.distanceMm = data.distance_mm
    this.durationMs = data.duration_ms
    this.speedKph = data.speed_kph
    this.restMs = data.rest_ms
    this.completedAt = data.completed_at
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.exercise = ExerciseModel.from(data.exercise!)
  }

  get isComplete(): boolean {
    return this.completedAt !== null
  }

  get isIncomplete(): boolean {
    return this.completedAt === null
  }

  get isWorkingSet(): boolean {
    return !this.isWarmup
  }

  get weight(): number | null {
    if (this.weightMcg === null) return null

    const metric = this.exercise.getMetricByType("weight")!
    return convert(this.weightMcg)
      .from("mcg")
      .to(metric.unit as Unit)
  }

  get duration(): number | null {
    if (this.durationMs === null) return null

    const metric = this.exercise.getMetricByType("duration")!
    return convert(this.durationMs)
      .from("ms")
      .to(metric.unit as Unit)
  }

  get distance(): number | null {
    if (this.distanceMm === null) return null

    const metric = this.exercise.getMetricByType("distance")!
    return convert(this.distanceMm)
      .from("mm")
      .to(metric.unit as Unit)
  }

  get volume(): number | null {
    if (!this.weightMcg || !this.reps) return null

    const metric = this.exercise.getMetricByType("weight")!
    return (
      convert(this.weightMcg)
        .from("mcg")
        .to(metric.unit as Unit) * this.reps
    )
  }

  update(data: Partial<SetModel>): void {
    Object.assign(this, data)
  }

  static from(set: SetModelType): SetModel {
    return new SetModel(set)
  }
}
