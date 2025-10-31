import convert, { Unit } from "convert-units"

import type { Exercise, Set } from "@/db/schema"
import { convertBaseDurationToUnit, convertBaseWeightToUnit } from "@/utils"
import { ExerciseModel } from "./ExerciseModel"

export type SetModelType = Set & {
  exercise?: Exercise
}

export class SetModel {
  raw_data: SetModelType

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
    this.raw_data = data

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
    return convertBaseWeightToUnit(this.weightMcg, metric.unit)
  }

  get duration(): number | null {
    if (this.durationMs === null) return null

    const metric = this.exercise.getMetricByType("duration")!
    return convertBaseDurationToUnit(this.durationMs, metric.unit)
  }

  get distance(): number | null {
    if (this.distanceMm === null) return null

    const metric = this.exercise.getMetricByType("distance")!
    return convert(this.distanceMm)
      .from("mm")
      .to(metric.unit as Unit)
  }

  get volume(): number | null {
    if (!this.weight || !this.reps) return null

    return this.weight * this.reps
  }

  get groupingValue(): number | null {
    const groupedBy = this.exercise.groupRecordsBy

    switch (groupedBy) {
      case "weight":
        return this.weight
      case "reps":
        return this.reps
      case "duration":
        return this.duration
      case "distance":
        return this.distance
      case "speed":
        return this.speedKph
      default:
        return null
    }
  }
  get measuredValue(): number | null {
    const measuredBy = this.exercise.measuredBy

    switch (measuredBy) {
      case "weight":
        return this.weight
      case "reps":
        return this.reps
      case "duration":
        return this.duration
      case "distance":
        return this.distance
      case "speed":
        return this.speedKph
      default:
        return null
    }
  }

  update(data: Partial<SetModel>): void {
    Object.assign(this, data)
  }

  static from(set: SetModelType): SetModel {
    return new SetModel(set)
  }
}
