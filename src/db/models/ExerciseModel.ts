import type { Exercise, ExerciseMetric } from "@/db/schema"

type ExerciseModelType = Exercise & {
  exerciseMetrics?: ExerciseMetric[]
}

export class ExerciseModel {
  declare id: number
  declare name: string
  declare images: string[]
  declare equipment: string[]
  declare muscle_areas: string[]
  declare muscles: string[]
  declare instructions: string[]
  declare tips: string[] | null
  declare position: string | null
  declare stance: string | null
  declare is_favorite: boolean
  declare created_at: number
  declare updated_at: number
  declare exerciseMetrics: ExerciseMetric[]

  constructor(data: ExerciseModelType) {
    Object.assign(this, data)
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
    return this.muscle_areas[0]
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
    return this.muscle_areas.includes(muscleArea)
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
