import { useCallback, useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"

export function useWorkoutFullQuery(openedDateMs: number, reactive: true): any
export function useWorkoutFullQuery(openedDateMs: number): any

export function useWorkoutFullQuery(
  openedDateMs: number | null,
  reactive: false,
): (dateMs: number) => Promise<any>

export function useWorkoutFullQuery(openedDateMs: number | null, reactive: boolean = true): any {
  const { drizzleDB } = useDB()

  const buildQuery = useCallback(
    (dateMs: number) => {
      return drizzleDB.query.workouts.findFirst({
        where: (workouts, { and, eq }) =>
          and(eq(workouts.date, dateMs), eq(workouts.is_template, false)),
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
    },
    [drizzleDB],
  )

  if (!reactive) {
    return buildQuery
  }

  const query = useMemo(() => buildQuery(openedDateMs!), [buildQuery, openedDateMs])

  return useExpoQuery(query, ["workouts", "workout_steps", "sets", "exercises", "exercise_metrics"], "single")
}
