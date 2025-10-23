import type { Exercise, Set } from "@/db/schema"
import convert, { Unit } from "convert-units"
import { ExerciseModel } from "./ExerciseModel"

type SetModelType = Set & {
  exercise?: Exercise
}

export class SetModel {
  declare id: number
  declare workout_step_id: number
  declare exercise_id: number
  declare is_warmup: boolean
  declare date: number
  declare is_weak_ass_record: boolean
  declare reps: number | null
  declare weight_mcg: number | null
  declare distance_mm: number | null
  declare duration_ms: number | null
  declare speed_kph: number | null
  declare rest_ms: number | null
  declare completed_at: number | null
  declare created_at: number
  declare updated_at: number
  exercise: ExerciseModel

  constructor(data: SetModelType) {
    Object.assign(this, data)
    this.exercise = ExerciseModel.from(data.exercise!)
  }

  get isComplete(): boolean {
    return this.completed_at !== null
  }

  get isIncomplete(): boolean {
    return this.completed_at === null
  }

  get isWarmup(): boolean {
    return this.is_warmup
  }

  get isWorkingSet(): boolean {
    return !this.is_warmup
  }

  get isPersonalRecord(): boolean {
    return this.is_weak_ass_record
  }

  get hasWeight(): boolean {
    return this.weight_mcg !== null
  }

  get hasReps(): boolean {
    return this.reps !== null
  }

  get hasDuration(): boolean {
    return this.duration_ms !== null
  }

  get hasDistance(): boolean {
    return this.distance_mm !== null
  }

  get hasSpeed(): boolean {
    return this.speed_kph !== null
  }

  get hasRest(): boolean {
    return this.rest_ms !== null
  }

  get weight(): number | null {
    if (this.weight_mcg === null) return null

    const metric = this.exercise.getMetricByType("weight")!
    return convert(this.weight_mcg)
      .from("mcg")
      .to(metric.unit as Unit)
  }

  get duration(): number | null {
    if (this.duration_ms === null) return null

    const metric = this.exercise.getMetricByType("duration")!
    return convert(this.duration_ms)
      .from("ms")
      .to(metric.unit as Unit)
  }

  get distance(): number | null {
    if (this.distance_mm === null) return null

    const metric = this.exercise.getMetricByType("distance")!
    return convert(this.distance_mm)
      .from("mm")
      .to(metric.unit as Unit)
  }

  get restSeconds(): number | null {
    return this.rest_ms !== null ? this.rest_ms / 1000 : null
  }

  get restMinutes(): number | null {
    return this.rest_ms !== null ? this.rest_ms / 60_000 : null
  }

  get speedKph(): number | null {
    return this.speed_kph
  }

  get speedMph(): number | null {
    return this.speed_kph !== null ? this.speed_kph * 0.621371 : null
  }

  get isStrengthSet(): boolean {
    return this.hasWeight && this.hasReps
  }

  get isCardioSet(): boolean {
    return this.hasDuration || this.hasDistance
  }

  get volume(): number | null {
    if (!this.weight_mcg || !this.reps) return null

    const metric = this.exercise.getMetricByType("weight")!
    return (
      convert(this.weight_mcg)
        .from("mcg")
        .to(metric.unit as Unit) * this.reps
    )
  }

  static from(set: SetModelType): SetModel {
    return new SetModel(set)
  }
}
