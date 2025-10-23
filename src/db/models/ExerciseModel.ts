import type { Exercise, ExerciseMetric } from "@/db/schema"

type ExerciseModelType = Exercise & {
  exerciseMetrics?: ExerciseMetric[]
}

export class ExerciseModel {
  id: number
  name: string
  images: string[]
  equipment: string[]
  muscleAreas: string[]
  muscles: string[]
  instructions: string[]
  tips: string[]
  position: string | null
  stance: string | null
  isFavorite: boolean
  createdAt: number
  updatedAt: number
  exerciseMetrics: ExerciseMetric[]

  constructor(data: ExerciseModelType) {
    this.id = data.id
    this.name = data.name
    this.images = data.images || []
    this.equipment = data.equipment || []
    this.muscleAreas = data.muscle_areas!
    this.muscles = data.muscles!
    this.instructions = data.instructions || []
    this.tips = data.tips || []
    this.position = data.position
    this.stance = data.stance
    this.isFavorite = data.is_favorite
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.exerciseMetrics = data.exerciseMetrics!
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

  hasMetricType(type: "weight" | "duration" | "reps" | "distance" | "speed" | "rest"): boolean {
    return !!this.exerciseMetrics?.some((metric) => metric.measurement_type === type)
  }

  getMetricByType(
    type: "weight" | "duration" | "reps" | "distance" | "speed" | "rest",
  ): ExerciseMetric | undefined {
    return this.exerciseMetrics?.find((metric) => metric.measurement_type === type)
  }

  get metricTypes(): ExerciseMetric["measurement_type"][] {
    return this.exerciseMetrics?.map((metric) => metric.measurement_type) ?? []
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

  static from(exercise: ExerciseModelType): ExerciseModel {
    return new ExerciseModel(exercise)
  }
}
