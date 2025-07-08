import { eq } from "drizzle-orm"

import { Exercise } from "@/data/types"
import { DrizzleDBType } from "@/db/useDB"

import type __state from "../../../data/GymWork_state.json"
import _state from "../../../data/GymWork_state_large.json"
import { METRICS, UNIT } from "../constants"
import { InsertSetGroup, schema } from "../schema"

const {
  //  configs
  record_calculation_configs,
  equipment,
  muscles,
  muscle_areas,
  metrics,

  // templates
  // workout_templates,
  // set_group_templates,
  // set_templates,

  // performed
  workouts,
  set_groups,
  sets,

  // exercises
  exercises,
  exercise_metrics,
  exercise_equipment,
  exercise_muscles,
  exercise_muscle_areas,

  // health
  discomfort_logs,

  // Tags
  // tags,
  // workout_templates_tags,
  // set_group_templates_tags,
  // set_templates_tags,
  // workouts_tags,
  // set_groups_tags,
  // sets_tags,
  // exercises_tags,
} = schema

const state = _state as typeof __state

function computeFlags(e: Exercise, measureRest = true) {
  return (
    ((e.measurements.weight ? 1 : 0) << 0) |
    ((e.measurements.reps != null ? 1 : 0) << 1) |
    ((e.measurements.duration != null ? 1 : 0) << 2) |
    ((e.measurements.distance != null ? 1 : 0) << 3) |
    ((measureRest ? 1 : 0) << 4)
  )
}

const DEFAULT_METRICS: {
  id: (typeof METRICS)[number]
  display_name: string
  unit: UNIT
  round_to: number
}[] = [
  { id: "weight_mcg", display_name: "Weight", unit: "kg", round_to: 2500_000 }, // 2.5kg
  { id: "reps", display_name: "Reps", unit: "count", round_to: 1 }, //
  { id: "duration_ms", display_name: "Duration", unit: "s", round_to: 1000 }, // 1 s
  { id: "distance_mm", display_name: "Distance", unit: "m", round_to: 1000 }, // 1 m
  { id: "rest_ms", display_name: "Rest", unit: "s", round_to: 1000 }, // 1 s
]

export async function seedMetrics(db: DrizzleDBType) {
  await db.delete(metrics).execute().catch(console.log)

  await db.insert(metrics).values(DEFAULT_METRICS).execute().catch(console.error)
}

// Prefill with defaults (run this once, e.g., in a migration)
export async function populateRecordConfigs(drizzleDB: DrizzleDBType) {
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
    [16, "weight_mcg", "desc", null, "desc"],
    [17, "reps", "desc", null, "desc"],
    [18, "weight_mcg", "desc", "reps", "desc"],
    [19, "duration_ms", "desc", null, "desc"],
    [20, "duration_ms", "desc", "weight_mcg", "desc"],
    [21, "duration_ms", "desc", "reps", "desc"],
    [22, "weight_mcg", "desc", "reps", "desc"],
    [23, "distance_mm", "desc", null, "desc"],
    [24, "distance_mm", "desc", null, "desc"],
    [25, "distance_mm", "desc", "reps", "desc"],
    [26, "weight_mcg", "desc", "reps", "desc"],
    [27, "duration_ms", "desc", "distance_mm", "desc"],
    [28, "duration_ms", "desc", "distance_mm", "desc"],
    [29, "duration_ms", "desc", "reps", "desc"],
    [30, "weight_mcg", "desc", "reps", "desc"],
    [31, "weight_mcg", "desc", "reps", "desc"],
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
        grouping_column: (typeof METRICS)[number]
        measurement_column: (typeof METRICS)[number]
        grouping_sort_direction: "asc" | "desc"
        measurement_sort_direction: "asc" | "desc"
      },
  )

  return drizzleDB.insert(record_calculation_configs).values(configs).run()
}

// assuming `state` is imported or passed in
export async function seedAll(drizzleDB: DrizzleDBType) {
  await seedMetrics(drizzleDB).catch(console.error)

  await drizzleDB.delete(record_calculation_configs).execute().catch(console.log)
  await populateRecordConfigs(drizzleDB).catch(console.error)

  const _muscleAreas = Array.from(
    new Set(state.exerciseStore.exercises.map((e) => e.muscleAreas).flat()),
  ).map((muscleArea, i): typeof muscle_areas.$inferInsert => {
    return {
      id: String(i), // TODO?
      name: muscleArea,
    }
  })
  await drizzleDB.insert(muscle_areas).values(_muscleAreas).execute().catch(console.error)
  console.log("inserted muscle areas")

  // Used as a fallback
  const [firstMuscleArea] = await drizzleDB
    .select()
    .from(muscle_areas)
    .limit(1)
    .execute()
    .catch((e) => {
      console.error(e)
      return []
    })

  const _muscles = Array.from(
    new Set(state.exerciseStore.exercises.map((e) => e.muscles).flat()),
  ).map((muscle, i): typeof muscles.$inferInsert => {
    return {
      id: String(i), // TODO?
      name: muscle,
    }
  })
  await drizzleDB.insert(muscles).values(_muscles).execute().catch(console.error)
  console.log("inserted muscles")

  const _equipment = Array.from(
    new Set(state.exerciseStore.exercises.map((e) => e.equipment).flat()),
  ).map((_equipment, i): typeof equipment.$inferInsert => {
    return {
      id: String(i), // TODO?
      name: _equipment,
    }
  })
  await drizzleDB.insert(equipment).values(_equipment).execute().catch(console.error)
  console.log("inserted equipment")

  // Position and stance are not implemented

  for (const e of state.exerciseStore.exercises) {
    const _exercise = {
      id: e.guid,
      name: e.name,
      is_favorite: false,
      tips: e.tips,
      instructions: e.instructions,
      images: e.images,

      record_config_id: computeFlags(e),
    }

    await drizzleDB.insert(exercises).values(_exercise).execute().catch(console.error)

    if ("weight" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: e.guid,
          metric_id: METRICS[0],
        })
        .execute()
        .catch(console.error)
    }
    if ("reps" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: e.guid,
          metric_id: METRICS[1],
        })
        .execute()
        .catch(console.error)
    }
    if ("duration" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: e.guid,
          metric_id: METRICS[2],
        })
        .execute()
        .catch(console.error)
    }
    if ("distance" in e.measurements) {
      await drizzleDB
        .insert(exercise_metrics)
        .values({
          exercise_id: e.guid,
          metric_id: METRICS[3],
        })
        .execute()
        .catch(console.error)
    }

    for (const e_equipment of e.equipment) {
      const [db_equipment_record] = await drizzleDB
        .select()
        .from(equipment)
        .where(eq(equipment.name, e_equipment))
        .limit(1)
        .execute()
        .catch((err) => {
          console.error(err)
          return []
        })

      await drizzleDB
        .insert(exercise_equipment)
        .values({
          equipment_id: db_equipment_record.id,
          exercise_id: e.guid,
        })
        .execute()
        .catch(console.error)
    }

    for (const e_muscle of e.muscles) {
      const [db_muscles_record] = await drizzleDB
        .select()
        .from(muscles)
        .where(eq(muscles.name, e_muscle))
        .limit(1)
        .execute()
        .catch((err) => {
          console.error(err)
          return []
        })

      await drizzleDB
        .insert(exercise_muscles)
        .values({
          muscle_id: db_muscles_record.id,
          exercise_id: e.guid,
        })
        .execute()
        .catch(console.error)
    }

    for (const e_muscleArea of e.muscleAreas) {
      const [db_muscleAreas_record] = await drizzleDB
        .select()
        .from(muscle_areas)
        .where(eq(muscle_areas.name, e_muscleArea))
        .limit(1)
        .execute()
        .catch((err) => {
          console.error(err)
          return []
        })

      await drizzleDB
        .insert(exercise_muscle_areas)
        .values({
          muscle_area_id: db_muscleAreas_record.id,
          exercise_id: e.guid,
        })
        .execute()
        .catch(console.error)
    }
  }
  console.log("added exercises, equipment, muscles, muscle areas")

  for (const workout of state.workoutStore.workouts) {
    await drizzleDB
      .insert(workouts)
      .values({
        id: workout.guid,
        created_at: new Date(workout.date).toISOString(),
        notes: workout.notes,
      })
      .execute()
      .catch(console.error)

    const setGroupAddPromises = workout.steps.map(async (step, i) => {
      const set_group_obj: InsertSetGroup = {
        id: step.guid,
        type: "plain" as const,
        workout_id: workout.guid,
        position: i,
      }

      // ! this times out on web sometimes
      await drizzleDB
        .insert(set_groups)
        .values(set_group_obj)
        .catch((err) => {
          console.log({
            err,
            obj: set_group_obj,
          })
        })

      // ! this times out on web sometimes
      const setGroupsPromise = step.sets.map(async (set, j) => {
        return drizzleDB
          .insert(sets)
          .values({
            id: set.guid,
            position: j,
            rpe: workout.rpe,
            reps: "reps" in set ? set.reps : null,
            weight_mcg: "weightMcg" in set ? set.weightMcg : null,
            duration_ms: "durationMs" in set ? set.durationMs : null,
            distance_mm: "distanceMm" in set ? set.distanceMm : null,
            rest_ms: "restMs" in set ? set.restMs : null,
            is_warmup: set.isWarmup,
            exercise_id: set.exercise,
            // workout_id: workout.guid,
            set_group_id: step.guid,
            // completed_at: new Date(set.completedAt),
            completed_at: null,
          })

          .execute()
          .catch(console.error)
      })

      return setGroupsPromise
    })

    await Promise.all(setGroupAddPromises.flat()).catch(console.error)

    if (workout.pain) {
      await drizzleDB
        .insert(discomfort_logs)
        .values({
          workout_id: workout.guid,
          muscle_area_id: firstMuscleArea.id, // TODO?
          severity: 5, // TODO?
          notes: workout.notes,
          // recorded_at: new Date(workout.endedAt).toISOString(),
        })
        .execute()
        .catch(console.error)
    }
  }
}

export async function clearAll(db: DrizzleDBType) {
  return Promise.all(
    Object.values(schema).map((table) => db.delete(table).execute().catch(console.error)),
  )
}
