import { SQL } from "drizzle-orm"
import { useMemo } from "react"

import { FilterForm } from "@/components/WorkoutHistoryScreen/components/WorkoutsFilterModal"
import { WorkoutModelRecord } from "@/db/models/WorkoutModel"
import { isoDateToMs } from "@/utils"

import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"

const tablesToWatch = [
  "workouts",
  "workout_steps",
  "workout_step_exercises",
  "sets",
  "exercises",
  "exercise_metrics",
]

export const useAllWorkoutsFullQuery = (
  filter: FilterForm,
  searchString: string,
): WorkoutModelRecord[] => {
  const { drizzleDB } = useDB()

  const query = useMemo(() => {
    return drizzleDB.query.workouts.findMany({
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
      where: (workouts, { and, eq, gte, lte, or, like }) => {
        const conditions: SQL<unknown>[] = [eq(workouts.is_template, false)]

        if (filter.discomfortLevel) {
          conditions.push(eq(workouts.pain, filter.discomfortLevel))
        }

        if (filter.dateFrom) {
          conditions.push(gte(workouts.date, isoDateToMs(filter.dateFrom)))
        }

        if (filter.dateTo) {
          conditions.push(lte(workouts.date, isoDateToMs(filter.dateTo)))
        }

        if (searchString.length > 0) {
          conditions.push(
            or(like(workouts.name, `%${searchString}%`), like(workouts.notes, `%${searchString}%`))!,
          )
        }

        if (conditions.length === 1) return conditions[0]
        return and(...conditions)
      },
      orderBy: (workouts, { desc }) => desc(workouts.date),
    })
  }, [drizzleDB, filter.dateFrom, filter.dateTo, filter.discomfortLevel, searchString])

  return useExpoQuery(query, tablesToWatch) as WorkoutModelRecord[]
}
