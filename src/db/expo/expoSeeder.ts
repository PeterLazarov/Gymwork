import { sql } from "drizzle-orm"
import type { useSQLiteContext } from "expo-sqlite"

import type __state from "../../data/data.json"
import _state from "../../data/data_large.json"
import { defaultSettings } from "../hooks"
import { schema } from "../schema"
import { DrizzleDBType } from "../useDB"
import { seedWorkouts } from "./seedWorkouts"

const { exercises, exercise_metrics, settings } = schema

const state = _state as typeof __state as {
  exerciseStore: {
    exercises: Array<{
      guid: string
      name: string
      images: string[]
      equipment: string[]
      instructions: string[]
      tips: string[]
      muscleAreas: string[]
      muscles: string[]
      measurements: Record<string, any>
      isFavorite: boolean
    }>
  }
}

export type ExerciseSeedList = typeof state.exerciseStore.exercises

type SeedOptions = {
  includeWorkouts?: boolean
}

export async function seedAll(drizzleDB: DrizzleDBType, options: SeedOptions = {}) {
  // Create default settings record if it doesn't exist
  const existingSettings = await drizzleDB.query.settings.findFirst()
  if (!existingSettings) {
    await drizzleDB.insert(settings).values(defaultSettings).execute()
    console.log("✅ Created default settings")
  }

  for (const e of state.exerciseStore.exercises) {
    const _exercise: typeof exercises.$inferInsert = {
      name: e.name,
      is_favorite: false,
      tips: e.tips,
      instructions: e.instructions,
      images: e.images,
      equipment: e.equipment,
      muscles: e.muscles,
      muscle_areas: e.muscleAreas,
      position: null,
      stance: null,
    }

    const exerciseInsertQuery = await drizzleDB
      .insert(exercises)
      .values(_exercise)
      .execute()
      .catch((err) => {
        console.error("ex", err)
        throw err
      })
    const exerciseId = exerciseInsertQuery!.lastInsertRowId

    // Insert exercise metrics
    if ("weight" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "weight",
          unit: "kg",
          more_is_better: true,
          step_value: 2.5,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics weight", err)
          throw err
        })
    }
    if ("reps" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "reps",
          unit: "reps",
          more_is_better: true,
          step_value: 1,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics reps", err)
          throw err
        })
    }
    if ("duration" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "duration",
          unit: "ms",
          more_is_better: false, // Less time is usually better for duration
          step_value: 1000,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics duration", err)
          throw err
        })
    }
    if ("distance" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: exerciseId,
          measurement_type: "distance",
          unit: "mm",
          more_is_better: true,
          step_value: 1000,
          min_value: 0,
          max_value: null,
        })
        .execute()
        .catch((err) => {
          console.error("metrics distance", err)
          throw err
        })
    }

    console.log("inserted exercise ", exerciseId)
  }
  console.log("added exercises")

  if (options.includeWorkouts) {
    await seedWorkouts(drizzleDB, state.exerciseStore.exercises)
  }
}

export async function dropAllTables(db: DrizzleDBType) {
  await db.transaction(async (tx) => {
    // 1. fetch all non-system tables
    const tables: { name: string }[] = await tx.all(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
    )

    // 2. drop each one
    for (const { name } of tables) {
      await tx.run(
        // identifier() safely quotes the table name
        sql`DROP TABLE IF EXISTS ${sql.identifier(name)};`,
      )
    }
  })
}

export async function clearAll(db: DrizzleDBType, sqlite: ReturnType<typeof useSQLiteContext>) {
  const tables = [
    schema.settings,
    schema.exercises,
    schema.exercise_metrics,
    schema.workouts,
    schema.workout_steps,
    schema.workout_step_exercises,
    schema.sets,
    schema.tags,
    schema.workouts_tags,
    schema.workout_steps_tags,
    schema.sets_tags,
    schema.exercises_tags,
  ]

  return Promise.all(
    tables.map((table) =>
      db
        .delete(table)
        .execute()
        .catch((err) => {
          console.error(err)
          throw err
        }),
    ),
  )

  // dropAllTables(db)
}
