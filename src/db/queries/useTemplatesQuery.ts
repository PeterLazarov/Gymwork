import { useMemo } from "react"

import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"
import { useTanstackQuery } from "@/tanstack-query"

export const useTemplatesQuery = (params?: { limit?: number }) => {
  const { drizzleDB } = useDB()

  const query = useMemo(() => {
    return drizzleDB.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.is_template, true),
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
      limit: params?.limit,
    })
  }, [drizzleDB])

  const { data, isLoading } = useTanstackQuery(query, [
    "workouts",
    "workout_steps",
    "sets",
    "exercises",
    "exercise_metrics",
  ])

  return {
    templates: data ?? [],
    isLoading,
  }
}
