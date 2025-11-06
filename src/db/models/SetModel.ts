import convert, { Unit } from "convert-units"

import type { Exercise, ExerciseMetric, Set } from "@/db/schema"
import { convertBaseDurationToUnit, convertBaseWeightToUnit, convertWeightToBase } from "@/utils"
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

  get speed(): number | null {
    return null
  }

  get rest(): number | null {
    return null
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

  static createDefaultForExercise({
    exercise,
    workoutStepId,
    date,
    defaultReps = 10,
    defaultMetricValue = 10,
  }: {
    exercise: ExerciseModel
    workoutStepId: number
    date: number
    defaultReps?: number
    defaultMetricValue?: number
  }): SetModel {
    const timestamp = date || Date.now()

    const exerciseRaw: Exercise & { exerciseMetrics?: ExerciseMetric[] } = {
      id: exercise.id ?? -1,
      name: exercise.name,
      images: exercise.images,
      equipment: exercise.equipment,
      muscle_areas: exercise.muscleAreas,
      muscles: exercise.muscles,
      instructions: exercise.instructions ?? [],
      tips: exercise.tips ?? [],
      position: exercise.position ?? null,
      stance: exercise.stance ?? null,
      is_favorite: exercise.isFavorite,
      created_at: exercise.createdAt ?? timestamp,
      updated_at: exercise.updatedAt ?? timestamp,
      exerciseMetrics: exercise.metrics,
    }

    const safeConvert = (unit: string | undefined, target: Unit): number | null => {
      if (!unit) return null
      try {
        return convert(defaultMetricValue)
          .from(unit as Unit)
          .to(target)
      } catch {
        return defaultMetricValue
      }
    }

    const weightMetric = exercise.getMetricByType("weight")
    const distanceMetric = exercise.getMetricByType("distance")
    const durationMetric = exercise.getMetricByType("duration")
    const restMetric = exercise.getMetricByType("rest")
    const speedMetric = exercise.getMetricByType("speed")

    const rawSet: SetModelType = {
      id: -1,
      workout_step_id: workoutStepId,
      exercise_id: exercise.id ?? -1,
      is_warmup: false,
      date,
      is_weak_ass_record: false,
      reps: exercise.hasMetricType("reps") ? defaultReps : null,
      weight_mcg: weightMetric ? convertWeightToBase(defaultMetricValue, weightMetric.unit) : null,
      distance_mm: distanceMetric ? safeConvert(distanceMetric.unit, "mm") : null,
      duration_ms: durationMetric ? safeConvert(durationMetric.unit, "ms") : null,
      speed_kph: speedMetric ? defaultMetricValue : null,
      rest_ms: restMetric ? safeConvert(restMetric.unit, "ms") : null,
      completed_at: null,
      created_at: timestamp,
      updated_at: timestamp,
      exercise: exerciseRaw,
    }

    return new SetModel(rawSet)
  }
}
