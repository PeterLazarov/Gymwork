import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { WorkoutModel } from "../models/WorkoutModel"
import { Workout, workout_step_exercises, workout_steps, workouts } from "../schema"
import { useDB } from "../useDB"

export const useUpdateWorkoutQuery = () => {
  const { drizzleDB } = useDB()

  async function deleteAndRecreateWorkoutSteps(
    workoutId: number,
    steps: WorkoutModel["workoutSteps"],
    timestamp: number,
  ) {
    await drizzleDB.delete(workout_steps).where(eq(workout_steps.workout_id, workoutId))

    for (const step of steps) {
      const stepResult = await drizzleDB
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
        await drizzleDB.insert(workout_step_exercises).values(
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

  return async (
    workoutId: number,
    workout: Partial<WorkoutModel>,
    overwriteSteps: boolean = false,
  ) => {
    const timestamp = DateTime.now().toMillis()

    const updateData: Partial<Workout> = {
      updated_at: timestamp,
    }

    if (workout.date !== undefined) updateData.date = workout.date
    if (workout.isTemplate !== undefined) updateData.is_template = workout.isTemplate
    if (workout.feeling !== undefined) updateData.feeling = workout.feeling
    if (workout.notes !== undefined) updateData.notes = workout.notes
    if (workout.rpe !== undefined) updateData.rpe = workout.rpe
    if (workout.pain !== undefined) updateData.pain = workout.pain
    if (workout.name !== undefined) updateData.name = workout.name
    if (workout.endedAt !== undefined) updateData.ended_at = workout.endedAt
    if (workout.durationMs !== undefined) updateData.duration_ms = workout.durationMs

    await drizzleDB.update(workouts).set(updateData).where(eq(workouts.id, workoutId))

    if (overwriteSteps && workout.workoutSteps !== undefined) {
      await deleteAndRecreateWorkoutSteps(workoutId, workout.workoutSteps, timestamp)
    }

    return drizzleDB.select().from(workouts).where(eq(workouts.id, workoutId))
  }
}
