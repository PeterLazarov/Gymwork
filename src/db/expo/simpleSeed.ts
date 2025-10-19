import { schema } from "../schema"
import { DrizzleDBType } from "../useDB"

const { exercises, exercise_metrics } = schema

const DEFAULT_EXERCISES = [
  {
    name: "Barbell Bench Press",
    equipment: ["Barbell"],
    muscles: ["Chest", "Triceps", "Shoulders"],
    muscle_areas: ["Upper Chest", "Lower Chest"],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Squat",
    equipment: ["Barbell"],
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Deadlift",
    equipment: ["Barbell"],
    muscles: ["Back", "Hamstrings", "Glutes"],
    muscle_areas: ["Upper Back", "Lower Back"],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Pull-ups",
    equipment: ["Bodyweight"],
    muscles: ["Back", "Biceps"],
    muscle_areas: ["Upper Back"],
    measurements: [
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Dumbbell Shoulder Press",
    equipment: ["Dumbbell"],
    muscles: ["Shoulders", "Triceps"],
    muscle_areas: ["Front Delts", "Side Delts"],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Barbell Row",
    equipment: ["Barbell"],
    muscles: ["Back", "Biceps"],
    muscle_areas: ["Upper Back"],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Dumbbell Bicep Curl",
    equipment: ["Dumbbell"],
    muscles: ["Biceps", "Forearms"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Tricep Pushdown",
    equipment: ["Cable"],
    muscles: ["Triceps"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Leg Press",
    equipment: ["Machine"],
    muscles: ["Quadriceps", "Glutes"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Running",
    equipment: ["Bodyweight"],
    muscles: ["Quadriceps", "Hamstrings", "Calves"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "distance" as const, unit: "m", more_is_better: true, step_value: 100 },
      { measurement_type: "duration" as const, unit: "s", more_is_better: false, step_value: 1 },
    ],
  },
  {
    name: "Plank",
    equipment: ["Bodyweight"],
    muscles: ["Abs", "Obliques"],
    muscle_areas: ["Upper Abs", "Lower Abs"],
    measurements: [
      { measurement_type: "duration" as const, unit: "s", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Lat Pulldown",
    equipment: ["Cable", "Machine"],
    muscles: ["Back", "Biceps"],
    muscle_areas: ["Upper Back"],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Leg Curl",
    equipment: ["Machine"],
    muscles: ["Hamstrings"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
  {
    name: "Calf Raises",
    equipment: ["Machine", "Bodyweight"],
    muscles: ["Calves"],
    muscle_areas: [],
    measurements: [
      { measurement_type: "weight" as const, unit: "kg", more_is_better: true, step_value: 2.5 },
      { measurement_type: "reps" as const, unit: "count", more_is_better: true, step_value: 1 },
    ],
  },
]

export async function seedSimple(drizzleDB: DrizzleDBType) {
  console.log("Starting simple seed...")

  try {
    // Seed exercises with their measurements
    for (const exerciseData of DEFAULT_EXERCISES) {
      const [exercise] = await drizzleDB
        .insert(exercises)
        .values({
          name: exerciseData.name,
          equipment: exerciseData.equipment,
          muscles: exerciseData.muscles,
          muscle_areas: exerciseData.muscle_areas,
          is_favorite: false,
        })
        .returning()
        .execute()

      console.log(`Seeded exercise: ${exerciseData.name}`)

      // Insert measurements for this exercise
      for (const measurement of exerciseData.measurements) {
        await drizzleDB
          .insert(exercise_metrics)
          .values({
            exercise_id: exercise.id,
            measurement_type: measurement.measurement_type,
            unit: measurement.unit,
            more_is_better: measurement.more_is_better,
            step_value: measurement.step_value,
          })
          .execute()
      }

      console.log(`Seeded measurements for: ${exerciseData.name}`)
    }

    console.log("Simple seed completed successfully!")
  } catch (error) {
    console.error("Error in seedSimple:", error)
    throw error
  }
}
