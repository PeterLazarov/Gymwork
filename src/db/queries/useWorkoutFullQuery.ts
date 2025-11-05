import { WorkoutModelRecord } from "@/db/models/WorkoutModel"
import { useCallback, useMemo } from "react"

import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"

type UseWorkoutFullQueryReactiveResult = {
  workout: WorkoutModelRecord | null
  isLoading: boolean
}

export function useWorkoutFullQuery(
  openedDateMs: number,
  reactive: true,
): UseWorkoutFullQueryReactiveResult
export function useWorkoutFullQuery(openedDateMs: number): UseWorkoutFullQueryReactiveResult

export function useWorkoutFullQuery(
  openedDateMs: number | null,
  reactive: false,
): (dateMs: number) => unknown

export function useWorkoutFullQuery(
  openedDateMs: number | null,
  reactive: boolean = true,
): UseWorkoutFullQueryReactiveResult | ((dateMs: number) => unknown) {
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

  const { data, isLoading } = useExpoQuery(
    query,
    ["workouts", "workout_steps", "workout_step_exercises", "sets", "exercises", "exercise_metrics"],
    "single",
  )

  return {
    workout: data ?? null,
    isLoading,
  }
}
