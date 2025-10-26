import type { Exercise, ExerciseMetric } from "@/db/schema"
import { MetricType } from "../../constants/enums"

type ExerciseModelType = Exercise & {
  exerciseMetrics?: ExerciseMetric[]
}

export class ExerciseModel {
  id?: number
  name: string
  images: string[]
  equipment: string[]
  muscleAreas: string[]
  muscles: string[]
  instructions: string[]
  tips: string[]
  position?: string
  stance?: string
  isFavorite: boolean
  createdAt: number
  updatedAt: number
  metrics: ExerciseMetric[]

  constructor(data?: ExerciseModelType) {
    this.id = data?.id
    this.name = data?.name ?? ""
    this.images = data?.images ?? []
    this.equipment = data?.equipment ?? []
    this.muscleAreas = data?.muscle_areas ?? []
    this.muscles = data?.muscles ?? []
    this.instructions = data?.instructions ?? []
    this.tips = data?.tips ?? []
    this.position = data?.position ?? undefined
    this.stance = data?.stance ?? undefined
    this.isFavorite = data?.is_favorite ?? false
    this.createdAt = data?.created_at ?? 0
    this.updatedAt = data?.updated_at ?? 0
    this.metrics = data?.exerciseMetrics ?? []
  }

  get hasImages(): boolean {
    return this.images.length > 0
  }

  get hasTips(): boolean {
    return !!this.tips && this.tips.length > 0
  }

  get hasInstructions(): boolean {
    return this.instructions.length > 0
  }

  get primaryMuscleArea(): string | undefined {
    return this.muscleAreas[0]
  }

  get primaryMuscle(): string | undefined {
    return this.muscles[0]
  }

  get hasEquipment(): boolean {
    return this.equipment.length > 0
  }

  get isBodyweight(): boolean {
    return this.equipment.length === 0 || this.equipment.includes("bodyweight")
  }

  get hasPosition(): boolean {
    return !!this.position
  }

  get hasStance(): boolean {
    return !!this.stance
  }

  hasMetricType(type: MetricType): boolean {
    return !!this.metrics?.some((metric) => metric.measurement_type === type)
  }

  getMetricByType(type: MetricType): ExerciseMetric | undefined {
    return this.metrics?.find((metric) => metric.measurement_type === type)
  }

  get metricTypes(): MetricType[] {
    return this.metrics?.map((metric) => metric.measurement_type) ?? []
  }

  get isWeightExercise(): boolean {
    return this.hasMetricType("weight")
  }

  get isCardioExercise(): boolean {
    return this.hasMetricType("duration") || this.hasMetricType("distance")
  }

  targetsMuscleArea(muscleArea: string): boolean {
    return this.muscleAreas.includes(muscleArea)
  }

  targetsMuscle(muscle: string): boolean {
    return this.muscles.includes(muscle)
  }

  requiresEquipment(equipment: string): boolean {
    return this.equipment.includes(equipment)
  }

  update(updates: Partial<ExerciseModel>): ExerciseModel {
    return Object.assign(this, updates)
  }

  static from(exercise: ExerciseModelType): ExerciseModel {
    return new ExerciseModel(exercise)
  }
}
