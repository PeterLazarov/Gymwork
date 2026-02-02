import { sql } from "drizzle-orm"
import type { useSQLiteContext } from "expo-sqlite"

import { withOperation } from "../../utils/observability"
import { defaultSettings } from "../hooks"
import { schema } from "../schema"
import { DrizzleDBType } from "../useDB"
import { ExerciseSeedData, seedExercises } from "./seedExercises"
import { seedWorkouts } from "./seedWorkouts"

const { settings } = schema

export type ExerciseSeedList = ExerciseSeedData[]

type SeedOptions = {
  includeWorkouts?: boolean
}

export async function seedAll(drizzleDB: DrizzleDBType, options: SeedOptions = {}) {
  return withOperation("db.seedAll", async () => {
    const existingSettings = await drizzleDB.query.settings.findFirst()
    if (!existingSettings) {
      await drizzleDB.insert(settings).values(defaultSettings).execute()
      console.log("✅ Created default settings")
    }

    const exerciseSeedData = await seedExercises(drizzleDB)

    if (options.includeWorkouts) {
      await seedWorkouts(drizzleDB, exerciseSeedData)
    }
  })
}

export async function dropAllTables(db: DrizzleDBType) {
  return withOperation("db.dropAllTables", async () => {
    await db.transaction(async (tx) => {
      const tables: { name: string }[] = await tx.all(
        sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
      )
      for (const { name } of tables) {
        await tx.run(sql`DROP TABLE IF EXISTS ${sql.identifier(name)};`)
      }
    })
  })
}

export async function clearAll(db: DrizzleDBType, sqlite: ReturnType<typeof useSQLiteContext>) {
  return withOperation("db.clearAll", async () => {
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
  })

  // dropAllTables(db)
}
