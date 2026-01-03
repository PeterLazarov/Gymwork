import { and, arrayContained, arrayOverlaps, asc, count, desc, eq, exists, gt, inArray, like, or, sql } from "drizzle-orm"
import { DateTime } from "luxon"
import { ExerciseModel } from "../models/ExerciseModel"
import { SetModel } from "../models/SetModel"
import { WorkoutModel } from "../models/WorkoutModel"
import {
  Exercise,
  ExerciseMetric,
  InsertSettings,
  Set,
  Workout,
  exercise_metrics,
  exercises,
  sets,
  settings,
  workout_step_exercises,
  workout_steps,
  workouts,
} from "../schema"
import type { DrizzleDBType } from "../useDB"
import { ExerciseFilters, WorkoutFilters } from "../hooks"

type DatabaseWorkoutFilters = Omit<WorkoutFilters, "dateFrom" | "dateTo"> & {
  dateFrom?: number
  dateTo?: number
  search?: string
}

type InsertWorkoutStepParams = {
  workoutId: number
  exercises: ExerciseModel[]
  sets?: SetModel[]
  stepData?: {
    id: number
    stepType: "plain" | "superset" | "circuit" | "emom" | "amrap" | "custom"
    position: number
    createdAt: number
    updatedAt: number
  }
}

/**
 * Pure database service layer - no React dependencies
 * All methods are pure functions that operate on the Drizzle DB instance
 */
export class DatabaseService {
  public getDrizzle() {
    return this.db
  }
  constructor(private db: DrizzleDBType) {}

  // ============================================================================
  // QUERIES - Exercises
  // ============================================================================

  async getExercises(filters?: ExerciseFilters) {
    return this.db.query.exercises.findMany({
      where: (exercises, { eq, like, and }) => {
        const conditions = []

        if (filters?.isFavorite !== undefined) {
          conditions.push(eq(exercises.is_favorite, filters.isFavorite))
        }

        // Search filtering is handled by Fuse.js in the hook's select function
        // if (filters?.search) {
        //   const words = filters.search.trim().split(" ")
        //   words.forEach((word) => {
        //     conditions.push(like(exercises.name, `%${word}%`))
        //   })
        // }

        if (filters?.equipment) {
          conditions.push(sql`instr(${exercises.equipment}, ${filters.equipment}) > 0`)
        }

        if (filters?.muscleArea) {
          conditions.push(sql`instr(${exercises.muscle_areas}, ${filters.muscleArea}) > 0`)
        }

        if (filters?.muscle) {
          conditions.push(sql`instr(${exercises.muscles}, ${filters.muscle}) > 0`)
        }

        if (conditions.length === 0) return undefined
        if (conditions.length === 1) return conditions[0]
        return and(...conditions)
      },
    })
  }

  async getMostUsedExercises(limit: number, filters: ExerciseFilters) {
    const conditions = []
    
    // Search filtering is handled by Fuse.js in the hook's select function
    // if (filters?.search) {
    //   const words = filters.search.trim().split(" ")
    //   words.forEach((word) => {
    //     conditions.push(like(exercises.name, `%${word}%`))
    //   })
    // }
    
    if (filters.muscleArea) {
      conditions.push(sql`instr(${exercises.muscle_areas}, ${filters.muscleArea}) > 0`)
    }
    
    if (filters.muscle) {
      conditions.push(sql`instr(${exercises.muscles}, ${filters.muscle}) > 0`)
    }

    if (filters.equipment) {
      conditions.push(sql`instr(${exercises.equipment}, ${filters.equipment}) > 0`)
    }
    
    return this.db
      .select({
        exercise: exercises,
        usage_count: count(workout_step_exercises.id),
      })
      .from(exercises)
      .innerJoin(workout_step_exercises, eq(workout_step_exercises.exercise_id, exercises.id))
      .groupBy(exercises.id)
      .orderBy(desc(count(workout_step_exercises.id)))
      .where(and(...conditions))
      .limit(limit)
  }

  async getExercise(exerciseId: number) {
    return this.db.query.exercises.findFirst({
      where: (exercises, { eq }) => eq(exercises.id, exerciseId),
    })
  }

  async getWorkoutsForExercise(
    exerciseId: number,
    filters?: { startDate?: number; endDate?: number; limit?: number },
  ) {
    return this.db.query.workouts.findMany({
      where: (workouts, { eq, and, gte, lte, exists }) => {
        const conditions = [
          eq(workouts.is_template, false),
          exists(
            this.db
              .select()
              .from(workout_steps)
              .innerJoin(sets, eq(sets.workout_step_id, workout_steps.id))
              .where(
                and(eq(workout_steps.workout_id, workouts.id), eq(sets.exercise_id, exerciseId)),
              ),
          ),
        ]

        if (filters?.startDate) {
          conditions.push(gte(workouts.date, filters.startDate))
        }

        if (filters?.endDate) {
          conditions.push(lte(workouts.date, filters.endDate))
        }

        return and(...conditions)
      },
      orderBy: (workouts, { desc }) => [desc(workouts.date)],
      limit: filters?.limit,
      with: {
        workoutSteps: {
          with: {
            workoutStepExercises: {
              with: {
                exercise: {
                  with: {
                    exerciseMetrics: true,
                  },
                },
              },
            },
            sets: {
              with: {
                exercise: {
                  with: {
                    exerciseMetrics: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async getExerciseLastSet(exerciseId: number) {
    return this.db.query.sets.findFirst({
      where: (sets, { eq }) => eq(sets.exercise_id, exerciseId),
      orderBy: (sets, { desc }) => [desc(sets.created_at)],
      with: {
        exercise: {
          with: {
            exerciseMetrics: true,
          },
        },
      },
    })
  }

  async getExerciseRecords(exerciseId: number) {
    const recordIdsSubquery = this.db
      .select({ id: sql<number>`record_id`.as("id") })
      .from(sql`exercise_records`)
      .where(eq(sql`exercise_id`, exerciseId))

    return this.db.query.sets.findMany({
      where: (sets, { inArray }) => inArray(sets.id, recordIdsSubquery),
      with: {
        exercise: {
          with: {
            exerciseMetrics: true,
          },
        },
      },
      orderBy: (sets, { asc }) => [
        asc(
          sql<number>`(SELECT grouping_value FROM exercise_records er WHERE er.record_id = ${sets.id})`,
        ),
      ],
    })
  }

  // ============================================================================
  // QUERIES - Workouts
  // ============================================================================

  async getAllWorkoutIds(params?: { limit?: number }) {
    return this.db.query.workouts.findMany({
      columns: {
        id: true,
        date: true,
      },
      orderBy: (workouts, { asc }) => asc(workouts.date),
      limit: params?.limit,
    })
  }

  async getAllWorkoutsFull(filters?: DatabaseWorkoutFilters) {
    return this.db.query.workouts.findMany({
      where: (workouts, { and, gte, lte, eq, like, or }) => {
        const conditions = [eq(workouts.is_template, false)]

        if (filters?.discomfortLevel) {
          conditions.push(eq(workouts.pain, filters.discomfortLevel))
        }

        if (filters?.dateFrom) {
          conditions.push(gte(workouts.date, filters.dateFrom))
        }

        if (filters?.dateTo) {
          conditions.push(lte(workouts.date, filters.dateTo))
        }


        if (filters?.muscleArea) {
          conditions.push(
            exists(
              this.db
                .select()
                .from(workout_steps)
                .innerJoin(sets, eq(sets.workout_step_id, workout_steps.id))
                .innerJoin(exercises, eq(exercises.id, sets.exercise_id))
                .where(
                  and(
                    eq(workout_steps.workout_id, workouts.id),
                    sql`instr(${exercises.muscle_areas}, ${filters.muscleArea}) > 0`,
                  ),
                ),
            ),
          )
        }

        if (filters?.muscle) {
          conditions.push(
            exists(
              this.db
                .select()
                .from(workout_steps)
                .innerJoin(sets, eq(sets.workout_step_id, workout_steps.id))
                .innerJoin(exercises, eq(exercises.id, sets.exercise_id))
                .where(
                  and(
                    eq(workout_steps.workout_id, workouts.id),
                    sql`instr(${exercises.muscles}, ${filters.muscle}) > 0`,
                  ),
                ),
            ),
          )
        }

        if (filters?.search && filters.search.trim() !== "") {
          const s = filters.search.trim()
          conditions.push(or(like(workouts.name, `%${s}%`), like(workouts.notes, `%${s}%`))!)
        }

        return and(...conditions)
      },
      orderBy: (workouts, { desc }) => [desc(workouts.date)],
      limit: filters?.limit,
      with: {
        workoutSteps: {
          orderBy: (workout_steps, { asc }) => [asc(workout_steps.position)],
          with: {
            workoutStepExercises: {
              with: {
                exercise: {
                  with: {
                    exerciseMetrics: true,
                  },
                },
              },
            },
            sets: {
              with: {
                exercise: {
                  with: {
                    exerciseMetrics: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async getWorkoutByDate(dateMs: number) {
    return this.db.query.workouts.findFirst({
      where: (workouts, { and, eq }) =>
        and(eq(workouts.date, dateMs), eq(workouts.is_template, false)),
      with: {
        workoutSteps: {
          orderBy: (workoutSteps, { asc }) => [asc(workoutSteps.position)],
          with: {
            workoutStepExercises: {
              with: {
                exercise: {
                  with: {
                    exerciseMetrics: true,
                  },
                },
              },
            },
            sets: {
              with: {
                exercise: {
                  with: {
                    exerciseMetrics: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async getTemplates() {
    return this.db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.is_template, true),
      orderBy: (workouts, { desc }) => [desc(workouts.updated_at)],
      with: {
        workoutSteps: {
          with: {
            workoutStepExercises: {
              with: {
                exercise: true,
              },
            },
            sets: {
              with: {
                exercise: true,
              },
            },
          },
        },
      },
    })
  }

  // ============================================================================
  // QUERIES - Sets
  // ============================================================================

  async getRecords(workoutStepId: number) {
    return this.db
      .select({
        id: sql<number>`er.record_id`.as("id"),
        isWeakAss: sql<boolean>`er.is_weak_ass`.as("isWeakAss"),
      })
      .from(sql`exercise_records er`)
      .innerJoin(sets, eq(sets.id, sql`er.record_id`))
      .where(eq(sets.workout_step_id, workoutStepId))
  }

  // ============================================================================
  // QUERIES - Settings
  // ============================================================================

  async getSettings() {
    return this.db.query.settings.findFirst({
      orderBy: (settings, { desc }) => [desc(settings.id)],
    })
  }

  // ============================================================================
  // MUTATIONS - Exercises
  // ============================================================================

  async insertExercise(exercise: Omit<Exercise, "id" | "created_at" | "updated_at">) {
    const timestamp = DateTime.now().toMillis()

    return this.db
      .insert(exercises)
      .values({
        ...exercise,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning()
  }

  async updateExercise(id: number, updates: Partial<ExerciseModel>) {
    const timestamp = DateTime.now().toMillis()
    const { metrics, muscleAreas, ...exerciseUpdates } = updates
    await this.db
      .update(exercises)
      .set({
        ...exerciseUpdates,
        muscle_areas: muscleAreas,
        updated_at: timestamp,
      })
      .where(eq(exercises.id, id))

    if (metrics !== undefined) {
      await this.deleteAndRecreateExerciseMetrics(id, metrics, timestamp)
    }

    return this.db.select().from(exercises).where(eq(exercises.id, id))
  }

  async deleteExercise(id: number) {
    const stepsToDelete = await this.db
      .select({ id: workout_steps.id })
      .from(workout_steps)
      .innerJoin(
        workout_step_exercises,
        eq(workout_steps.id, workout_step_exercises.workout_step_id),
      )
      .where(
        and(
          eq(workout_step_exercises.exercise_id, id),
          eq(workout_steps.step_type, "plain"),
        ),
      )

    const stepIds = stepsToDelete.map((s) => s.id)

    if (stepIds.length > 0) {
      await this.db.delete(workout_steps).where(inArray(workout_steps.id, stepIds))
    }

    return this.db.delete(exercises).where(eq(exercises.id, id))
  }

  // ============================================================================
  // MUTATIONS - Workouts
  // ============================================================================

  async insertWorkout(workout: Partial<WorkoutModel>) {
    const timestamp = DateTime.now().toMillis()

    const result = await this.db
      .insert(workouts)
      .values({
        date: workout.date,
        is_template: workout.isTemplate || false,
        created_at: timestamp,
        updated_at: timestamp,
        feeling: workout.feeling || null,
        notes: workout.notes || null,
        rpe: workout.rpe || null,
        pain: workout.pain || null,
        name: workout.name || null,
        ended_at: workout.endedAt || null,
        duration_ms: workout.durationMs || null,
      })
      .returning()

    const workoutId = result[0].id

    if (workout.workoutSteps && workout.workoutSteps.length > 0) {
      await this.createWorkoutSteps(workoutId, workout.workoutSteps, timestamp)
    }

    return result
  }

  async updateWorkout(
    workoutId: number,
    workout: Partial<WorkoutModel>,
    overwriteSteps: boolean = false,
  ) {
    const timestamp = DateTime.now().toMillis()

    const updateData: Partial<Workout> = {
      updated_at: timestamp,
    }

    if (Object.hasOwn(workout, "date")) updateData.date = workout.date
    if (Object.hasOwn(workout, "isTemplate")) updateData.is_template = workout.isTemplate
    if (Object.hasOwn(workout, "feeling")) updateData.feeling = workout.feeling
    if (Object.hasOwn(workout, "notes")) updateData.notes = workout.notes
    if (Object.hasOwn(workout, "rpe")) updateData.rpe = workout.rpe
    if (Object.hasOwn(workout, "pain")) updateData.pain = workout.pain
    if (Object.hasOwn(workout, "name")) updateData.name = workout.name
    if (Object.hasOwn(workout, "endedAt")) updateData.ended_at = workout.endedAt
    if (Object.hasOwn(workout, "durationMs")) updateData.duration_ms = workout.durationMs

    await this.db.update(workouts).set(updateData).where(eq(workouts.id, workoutId))

    if (overwriteSteps && workout.workoutSteps !== undefined) {
      await this.deleteAndRecreateWorkoutSteps(workoutId, workout.workoutSteps, timestamp)
    }

    return this.db.select().from(workouts).where(eq(workouts.id, workoutId))
  }

  async removeWorkout(workoutId: number) {
    return this.db.delete(workouts).where(eq(workouts.id, workoutId))
  }

  async copyWorkout(sourceWorkout: WorkoutModel, targetDate: number, copySets: boolean) {
    const timestamp = DateTime.now().toMillis()

    const newWorkout = await this.db
      .insert(workouts)
      .values({
        date: targetDate,
        name: sourceWorkout.name,
        notes: sourceWorkout.notes,
        is_template: false,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning()

    const newWorkoutId = newWorkout[0].id

    for (const step of sourceWorkout.workoutSteps) {
      const newStepResult = await this.db
        .insert(workout_steps)
        .values({
          workout_id: newWorkoutId,
          step_type: step.stepType,
          position: step.position,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .returning()

      const newStepId = newStepResult[0].id

      if (step.workoutStepExercises.length > 0) {
        await this.db.insert(workout_step_exercises).values(
          step.workoutStepExercises.map((wse) => ({
            workout_step_id: newStepId,
            exercise_id: wse.exercise_id,
            created_at: timestamp,
            updated_at: timestamp,
          })),
        )
      }

      if (copySets && step.sets.length > 0) {
        await this.db.insert(sets).values(
          step.sets.map((set) => ({
            workout_step_id: newStepId,
            exercise_id: set.exerciseId,
            is_warmup: set.isWarmup,
            date: targetDate,
            is_weak_ass_record: false,
            reps: set.reps,
            weight_mcg: set.weightMcg,
            distance_mm: set.distanceMm,
            duration_ms: set.durationMs,
            speed_kph: set.speedKph,
            rest_ms: set.restMs,
            completed_at: null,
            created_at: timestamp,
            updated_at: timestamp,
          })),
        )
      }
    }

    return newWorkout
  }

  // ============================================================================
  // MUTATIONS - Workout Steps
  // ============================================================================

  async insertWorkoutStep({
    workoutId,
    exercises,
    sets: stepSets,
    stepData,
  }: InsertWorkoutStepParams) {
    const timestamp = DateTime.now().toMillis()
    let stepId: number | null = null

    if (stepData) {
      const insertResult = await this.db
        .insert(workout_steps)
        .values({
          id: stepData.id,
          workout_id: workoutId,
          step_type: stepData.stepType,
          position: stepData.position,
          created_at: stepData.createdAt,
          updated_at: stepData.updatedAt,
        })
        .execute()

      stepId = insertResult.lastInsertRowId
    } else {
      const stepCountResult = await this.db
        .select({ count: count() })
        .from(workout_steps)
        .where(eq(workout_steps.workout_id, workoutId))

      const nextPosition = stepCountResult[0].count + 1

      const insertResult = await this.db
        .insert(workout_steps)
        .values({
          workout_id: workoutId,
          step_type: "plain",
          position: nextPosition,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .execute()

      stepId = insertResult.lastInsertRowId
    }

    if (stepId && exercises.length > 0) {
      await this.db
        .insert(workout_step_exercises)
        .values(
          exercises.map((ex) => ({
            workout_step_id: stepId!, // ts was drunk and forgot that stepid is not nullable in this if block
            exercise_id: ex.id!,
            created_at: stepData?.createdAt ?? timestamp,
            updated_at: stepData?.updatedAt ?? timestamp,
          })),
        )
        .execute()
    }

    if (stepSets && stepSets.length > 0) {
      await this.db
        .insert(sets)
        .values(
          stepSets.map((set) => ({
            id: set.id,
            workout_step_id: set.workoutStepId,
            exercise_id: set.exerciseId,
            is_warmup: set.isWarmup,
            date: set.date,
            is_weak_ass_record: set.isWeakAssRecord,
            reps: set.reps,
            weight_mcg: set.weightMcg,
            distance_mm: set.distanceMm,
            duration_ms: set.durationMs,
            speed_kph: set.speedKph,
            rest_ms: set.restMs,
            completed_at: set.completedAt,
            created_at: set.createdAt,
            updated_at: set.updatedAt,
          })),
        )
        .execute()
    }

    return stepId
  }

  async removeWorkoutStep(workoutStepId: number) {
    return this.db.delete(workout_steps).where(eq(workout_steps.id, workoutStepId))
  }

  async updateWorkoutStepExercise(workoutStepId: number, oldExerciseId: number, exerciseId: number) {
    const timestamp = DateTime.now().toMillis()
console.log("updateWorkoutStepExercise", workoutStepId, oldExerciseId, exerciseId)
    Promise.all([
      this.db.delete(workout_step_exercises).where(
        and(eq(workout_step_exercises.workout_step_id, workoutStepId), eq(workout_step_exercises.exercise_id, oldExerciseId))
      ),
      this.db.delete(sets).where(
        and(eq(sets.workout_step_id, workoutStepId), eq(sets.exercise_id, oldExerciseId))
      )
    ])

    return this.db.insert(workout_step_exercises).values({
      workout_step_id: workoutStepId,
      exercise_id: exerciseId,
      created_at: timestamp,
      updated_at: timestamp,
    })
  }

  async reorderWorkoutSteps(workoutId: number, from: number, to: number) {
    if (from === to) {
      return
    }

    const allSteps = await this.db
      .select()
      .from(workout_steps)
      .where(eq(workout_steps.workout_id, workoutId))
      .orderBy(asc(workout_steps.position))

    const reorderedSteps = [...allSteps]
    const [movedStep] = reorderedSteps.splice(from, 1)
    reorderedSteps.splice(to, 0, movedStep)

    const timestamp = DateTime.now().toMillis()

    await Promise.all(
      reorderedSteps.map((step, index) => {
        return this.db
          .update(workout_steps)
          .set({
            position: index,
            updated_at: timestamp,
          })
          .where(eq(workout_steps.id, step.id))
      }),
    )
  }

  async reorderWorkoutStepSets(workoutStepId: number, orderedSetIds: number[]) {
    const allSets = await this.db
      .select()
      .from(sets)
      .where(eq(sets.workout_step_id, workoutStepId))
      .orderBy(asc(sets.id))

    const setMap = new Map(allSets.map((s) => [s.id, s]))
    const orderedSets = orderedSetIds.map((id) => setMap.get(id)).filter(Boolean)

    if (orderedSets.length !== allSets.length) {
      throw new Error("Mismatch between provided IDs and existing sets")
    }

    const timestamp = DateTime.now().toMillis()

    await this.db.transaction(async (tx) => {
      for (const set of orderedSets) {
        await tx.update(sets).set({ updated_at: timestamp }).where(eq(sets.id, set!.id))
      }
    })
  }

  // ============================================================================
  // MUTATIONS - Sets
  // ============================================================================

  async insertSet(set: Partial<SetModel>, manualCompletion?: boolean) {
    const timestamp = DateTime.now().toMillis()

    return this.db
      .insert(sets)
      .values({
        workout_step_id: set.workoutStepId!,
        exercise_id: set.exerciseId!,
        date: set.date!,
        is_warmup: set.isWarmup ?? false,
        is_weak_ass_record: set.isWeakAssRecord ?? false,
        reps: set.reps ?? null,
        weight_mcg: set.weightMcg ?? null,
        distance_mm: set.distanceMm ?? null,
        duration_ms: set.durationMs ?? null,
        speed_kph: set.speedKph ?? null,
        rest_ms: set.restMs ?? null,
        completed_at: manualCompletion ? set.completedAt : null,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning()
  }

  async updateSet(setId: number, updates: Partial<SetModel>) {
    const timestamp = DateTime.now().toMillis()

    const updateData: Partial<Set> = {
      updated_at: timestamp,
    }

    if (updates.reps !== undefined) updateData.reps = updates.reps
    if (updates.weightMcg !== undefined) updateData.weight_mcg = updates.weightMcg
    if (updates.distanceMm !== undefined) updateData.distance_mm = updates.distanceMm
    if (updates.durationMs !== undefined) updateData.duration_ms = updates.durationMs
    if (updates.speedKph !== undefined) updateData.speed_kph = updates.speedKph
    if (updates.restMs !== undefined) updateData.rest_ms = updates.restMs
    if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt
    if (updates.isWarmup !== undefined) updateData.is_warmup = updates.isWarmup

    await this.db.update(sets).set(updateData).where(eq(sets.id, setId))

    return this.db.select().from(sets).where(eq(sets.id, setId))
  }

  async removeSet(setId: number) {
    return this.db.delete(sets).where(eq(sets.id, setId))
  }

  // ============================================================================
  // MUTATIONS - Settings
  // ============================================================================

  async updateSettings(id: number, updates: Partial<InsertSettings>) {
    return this.db
      .update(settings)
      .set({
        ...updates,
        updated_at: Date.now(),
      })
      .where(eq(settings.id, id))
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private async createWorkoutSteps(
    workoutId: number,
    steps: WorkoutModel["workoutSteps"],
    timestamp: number,
  ) {
    for (const step of steps) {
      const stepResult = await this.db
        .insert(workout_steps)
        .values({
          workout_id: workoutId,
          step_type: step.stepType,
          position: step.position,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .returning()

      const stepId = stepResult[0].id

      if (step.exercises && step.exercises.length > 0) {
        await this.db.insert(workout_step_exercises).values(
          step.exercises
            .filter((exercise) => exercise.id !== undefined)
            .map((exercise) => ({
              workout_step_id: stepId,
              exercise_id: exercise.id!,
              created_at: timestamp,
              updated_at: timestamp,
            })),
        )
      }
    }
  }

  private async deleteAndRecreateWorkoutSteps(
    workoutId: number,
    steps: WorkoutModel["workoutSteps"],
    timestamp: number,
  ) {
    await this.db.delete(workout_steps).where(eq(workout_steps.workout_id, workoutId))

    for (const step of steps) {
      const stepResult = await this.db
        .insert(workout_steps)
        .values({
          workout_id: workoutId,
          step_type: step.stepType,
          position: step.position,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .returning()

      const stepId = stepResult[0].id

      if (step.exercises && step.exercises.length > 0) {
        await this.db.insert(workout_step_exercises).values(
          step.exercises
            .filter((exercise) => exercise.id !== undefined)
            .map((exercise) => ({
              workout_step_id: stepId,
              exercise_id: exercise.id!,
              created_at: timestamp,
              updated_at: timestamp,
            })),
        )
      }
    }
  }

  private async deleteAndRecreateExerciseMetrics(
    exerciseId: number,
    metrics: ExerciseMetric[],
    timestamp: number,
  ) {
    await this.db.delete(exercise_metrics).where(eq(exercise_metrics.exercise_id, exerciseId))

    if (metrics.length > 0) {
      await this.db.insert(exercise_metrics).values(
        metrics.map((metric) => ({
          exercise_id: exerciseId,
          measurement_type: metric.measurement_type,
          unit: metric.unit,
          more_is_better: metric.more_is_better,
          step_value: metric.step_value ?? null,
          created_at: timestamp,
          updated_at: timestamp,
        })),
      )
    }
  }
}
