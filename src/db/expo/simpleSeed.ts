import { DrizzleDBType } from "@/db/useDB"

import { METRICS } from "../constants"
import { schema } from "../schema"

const {
  record_calculation_configs,
  equipment,
  muscles,
  muscle_areas,
  metrics,
  exercises,
  exercise_metrics,
  exercise_equipment,
  exercise_muscles,
  exercise_muscle_areas,
} = schema

const DEFAULT_METRICS = [
  { id: "weight_mcg" as const, display_name: "Weight", unit: "kg" as const, round_to: 2500_000 },
  { id: "reps" as const, display_name: "Reps", unit: "count" as const, round_to: 1 },
  { id: "duration_ms" as const, display_name: "Duration", unit: "s" as const, round_to: 1000 },
  { id: "distance_mm" as const, display_name: "Distance", unit: "m" as const, round_to: 1000 },
  { id: "rest_ms" as const, display_name: "Rest", unit: "s" as const, round_to: 1000 },
]

const DEFAULT_EQUIPMENT = [
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Resistance Band",
]

const DEFAULT_MUSCLES = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Abs",
  "Obliques",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
]

const DEFAULT_MUSCLE_AREAS = [
  "Upper Chest",
  "Lower Chest",
  "Upper Back",
  "Lower Back",
  "Front Delts",
  "Side Delts",
  "Rear Delts",
  "Upper Abs",
  "Lower Abs",
]

const DEFAULT_EXERCISES = [
  {
    name: "Barbell Bench Press",
    equipment: ["Barbell"],
    muscles: ["Chest", "Triceps", "Shoulders"],
    muscle_areas: ["Upper Chest", "Lower Chest"],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3, // weight + reps
  },
  {
    name: "Squat",
    equipment: ["Barbell"],
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    muscle_areas: [],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Deadlift",
    equipment: ["Barbell"],
    muscles: ["Back", "Hamstrings", "Glutes"],
    muscle_areas: ["Upper Back", "Lower Back"],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Pull-ups",
    equipment: ["Bodyweight"],
    muscles: ["Back", "Biceps"],
    muscle_areas: ["Upper Back"],
    metrics: ["reps"],
    record_config_id: 2,
  },
  {
    name: "Dumbbell Shoulder Press",
    equipment: ["Dumbbell"],
    muscles: ["Shoulders", "Triceps"],
    muscle_areas: ["Front Delts", "Side Delts"],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Barbell Row",
    equipment: ["Barbell"],
    muscles: ["Back", "Biceps"],
    muscle_areas: ["Upper Back"],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Dumbbell Bicep Curl",
    equipment: ["Dumbbell"],
    muscles: ["Biceps", "Forearms"],
    muscle_areas: [],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Tricep Pushdown",
    equipment: ["Cable"],
    muscles: ["Triceps"],
    muscle_areas: [],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Leg Press",
    equipment: ["Machine"],
    muscles: ["Quadriceps", "Glutes"],
    muscle_areas: [],
    metrics: ["weight_mcg", "reps"],
    record_config_id: 3,
  },
  {
    name: "Running",
    equipment: ["Bodyweight"],
    muscles: ["Quadriceps", "Hamstrings", "Calves"],
    muscle_areas: [],
    metrics: ["distance_mm", "duration_ms"],
    record_config_id: 12, // duration + distance
  },
]

// Prefill with defaults
async function populateRecordConfigs(drizzleDB: DrizzleDBType) {
  const configs = [
    [0, null, "desc", null, "desc"],
    [1, "weight_mcg", "desc", null, "desc"],
    [2, "reps", "desc", null, "desc"],
    [3, "weight_mcg", "desc", "reps", "desc"],
    [4, "duration_ms", "desc", null, "desc"],
    [5, "duration_ms", "desc", "weight_mcg", "desc"],
    [6, "duration_ms", "desc", "reps", "desc"],
    [7, "weight_mcg", "desc", "reps", "desc"],
    [8, "distance_mm", "desc", null, "desc"],
    [9, "distance_mm", "desc", null, "desc"],
    [10, "distance_mm", "desc", "reps", "desc"],
    [11, "weight_mcg", "desc", "reps", "desc"],
    [12, "duration_ms", "asc", "distance_mm", "desc"],
    [13, "duration_ms", "asc", "distance_mm", "desc"],
    [14, "duration_ms", "asc", "reps", "desc"],
    [15, "weight_mcg", "desc", "reps", "desc"],
  ].map(
    ([
      id,
      measurement_column,
      measurement_sort_direction,
      grouping_column,
      grouping_sort_direction,
    ]) =>
      ({
        id,
        grouping_column,
        measurement_column,
        grouping_sort_direction,
        measurement_sort_direction,
      }) as {
        id: number
        grouping_column: (typeof METRICS)[number] | null
        measurement_column: (typeof METRICS)[number] | null
        grouping_sort_direction: "asc" | "desc"
        measurement_sort_direction: "asc" | "desc"
      },
  )

  await drizzleDB.insert(record_calculation_configs).values(configs).execute()
}

export async function seedSimple(drizzleDB: DrizzleDBType) {
  console.log("Starting simple seed...")

  // Seed metrics
  await drizzleDB.insert(metrics).values(DEFAULT_METRICS).execute()
  console.log("Seeded metrics")

  // Seed record configs
  await populateRecordConfigs(drizzleDB)
  console.log("Seeded record configs")

  // Seed equipment
  const equipmentRecords = await drizzleDB
    .insert(equipment)
    .values(DEFAULT_EQUIPMENT.map((name) => ({ name })))
    .returning()
    .execute()
  console.log("Seeded equipment")

  // Create equipment lookup
  const equipmentMap = new Map(equipmentRecords.map((eq) => [eq.name, eq.id]))

  // Seed muscles
  const muscleRecords = await drizzleDB
    .insert(muscles)
    .values(DEFAULT_MUSCLES.map((name) => ({ name })))
    .returning()
    .execute()
  console.log("Seeded muscles")

  // Create muscle lookup
  const muscleMap = new Map(muscleRecords.map((m) => [m.name, m.id]))

  // Seed muscle areas
  const muscleAreaRecords = await drizzleDB
    .insert(muscle_areas)
    .values(DEFAULT_MUSCLE_AREAS.map((name) => ({ name })))
    .returning()
    .execute()
  console.log("Seeded muscle areas")

  // Create muscle area lookup
  const muscleAreaMap = new Map(muscleAreaRecords.map((ma) => [ma.name, ma.id]))

  // Seed exercises with relationships
  for (const exercise of DEFAULT_EXERCISES) {
    const [exerciseRecord] = await drizzleDB
      .insert(exercises)
      .values({
        name: exercise.name,
        is_favorite: false,
        record_config_id: exercise.record_config_id,
      })
      .returning()
      .execute()

    const exerciseId = exerciseRecord.id

    // Add metrics
    for (const metricId of exercise.metrics) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          metric_id: metricId,
        })
        .execute()
    }

    // Add equipment
    for (const equipmentName of exercise.equipment) {
      const equipmentId = equipmentMap.get(equipmentName)
      if (equipmentId) {
        await drizzleDB
          .insert(exercise_equipment)
          .values({
            exercise_id: exerciseId,
            equipment_id: equipmentId,
          })
          .execute()
      }
    }

    // Add muscles
    for (const muscleName of exercise.muscles) {
      const muscleId = muscleMap.get(muscleName)
      if (muscleId) {
        await drizzleDB
          .insert(exercise_muscles)
          .values({
            exercise_id: exerciseId,
            muscle_id: muscleId,
          })
          .execute()
      }
    }

    // Add muscle areas
    for (const muscleAreaName of exercise.muscle_areas) {
      const muscleAreaId = muscleAreaMap.get(muscleAreaName)
      if (muscleAreaId) {
        await drizzleDB
          .insert(exercise_muscle_areas)
          .values({
            exercise_id: exerciseId,
            muscle_area_id: muscleAreaId,
          })
          .execute()
      }
    }

    console.log(`Seeded exercise: ${exercise.name}`)
  }

  console.log("Simple seed completed!")
}

