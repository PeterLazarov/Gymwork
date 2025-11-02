import { and, eq } from "drizzle-orm"
import { useCallback, useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"

export function useExerciseHistoryQuery(exerciseId: number) {
  const { drizzleDB } = useDB()

  const buildQuery = useCallback(
    (exerciseId: number) => {
      return drizzleDB.query.workouts.findMany({
        where: (workouts, { eq }) => eq(workouts.is_template, false),
        with: {
          workoutSteps: {
            where: (workoutSteps, { exists }) =>
              exists(
                drizzleDB
                  .select()
                  .from(drizzleDB._.fullSchema.sets)
                  .where(
                    and(
                      eq(drizzleDB._.fullSchema.sets.workout_step_id, workoutSteps.id),
                      eq(drizzleDB._.fullSchema.sets.exercise_id, exerciseId),
                    ),
                  ),
              ),
            with: {
              workoutStepExercises: {
                where: (wse, { eq }) => eq(wse.exercise_id, exerciseId),
                with: {
                  exercise: {
                    with: {
                      exerciseMetrics: true,
                    },
                  },
                },
              },
              sets: {
                where: (sets, { eq }) => eq(sets.exercise_id, exerciseId),
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
        orderBy: (workouts, { desc }) => [desc(workouts.date)],
      })
    },
    [drizzleDB],
  )

  const query = useMemo(() => buildQuery(exerciseId), [buildQuery, exerciseId])

  return useExpoQuery(query, ["workouts", "workout_steps", "sets", "exercises", "exercise_metrics"], "multiple")
}
