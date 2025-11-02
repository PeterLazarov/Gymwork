import type { Exercise, ExerciseMetric } from "@/db/schema"
import { MetricType } from "../../constants/enums"

type ExerciseModelType = Exercise & {
  exerciseMetrics?: ExerciseMetric[]
}

const groupingCombinations: {
  measurement: MetricType[]
  groupBy: MetricType
}[] = [
  { measurement: ["weight"], groupBy: "weight" },
  { measurement: ["duration"], groupBy: "duration" },
  { measurement: ["duration", "weight"], groupBy: "weight" },
  { measurement: ["reps"], groupBy: "reps" },
  { measurement: ["reps", "weight"], groupBy: "reps" },
  { measurement: ["reps", "duration"], groupBy: "duration" },
  { measurement: ["reps", "duration", "weight"], groupBy: "duration" },
  { measurement: ["distance"], groupBy: "distance" },
  { measurement: ["distance", "weight"], groupBy: "weight" },
  { measurement: ["distance", "duration", "speed"], groupBy: "distance" },
  { measurement: ["distance", "duration"], groupBy: "distance" },
  { measurement: ["distance", "duration", "weight"], groupBy: "duration" },
  { measurement: ["distance", "reps"], groupBy: "reps" },
  { measurement: ["distance", "reps", "weight"], groupBy: "reps" },
  { measurement: ["distance", "reps", "duration"], groupBy: "reps" },
  { measurement: ["distance", "reps", "duration", "weight"], groupBy: "reps" },
]

const measurementCombinations: {
  measurement: MetricType[]
  measureBy: MetricType
}[] = [
  { measurement: ["weight"], measureBy: "weight" },
  { measurement: ["duration"], measureBy: "duration" },
  { measurement: ["duration", "weight"], measureBy: "duration" },
  { measurement: ["reps"], measureBy: "reps" },
  { measurement: ["reps", "weight"], measureBy: "weight" },
  { measurement: ["reps", "duration"], measureBy: "reps" },
  { measurement: ["distance"], measureBy: "distance" },
  { measurement: ["distance", "weight"], measureBy: "distance" },
  { measurement: ["distance", "duration", "speed"], measureBy: "duration" },
  { measurement: ["distance", "duration"], measureBy: "duration" },
  { measurement: ["distance", "reps"], measureBy: "distance" },
]

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

  get groupRecordsBy(): MetricType | undefined {
    const exerciseMetricTypes = this.metricTypes
    const groupByFallback = exerciseMetricTypes[0]

    const combination = groupingCombinations.find((cfg) => {
      return exerciseMetricTypes.every((type) => cfg.measurement.includes(type))
    })

    return combination?.groupBy || groupByFallback
  }

  get measuredBy(): MetricType | undefined {
    const exerciseMetricTypes = this.metricTypes
    const measureByFallback = exerciseMetricTypes[0]

    const combination = measurementCombinations.find((cfg) => {
      return cfg.measurement.every((type) => exerciseMetricTypes.includes(type))
    })

    return combination?.measureBy || measureByFallback
  }

  get groupingMeasurement(): ExerciseMetric | undefined {
    return this.groupRecordsBy ? this.getMetricByType(this.groupRecordsBy) : undefined
  }

  get valueMeasurement(): ExerciseMetric | undefined {
    return this.measuredBy ? this.getMetricByType(this.measuredBy) : undefined
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

  static copy(source: ExerciseModel) {
    return new ExerciseModel({
      ...source,
      id: source.id ?? -1,
      position: source.position || null,
      stance: source.stance || null,
      muscle_areas: source.muscleAreas,
      is_favorite: source.isFavorite,
      created_at: source.createdAt,
      updated_at: source.updatedAt,
      exerciseMetrics: source.metrics,
    })
  }
  
  static from(exercise: ExerciseModelType): ExerciseModel {
    return new ExerciseModel(exercise)
  }
}
