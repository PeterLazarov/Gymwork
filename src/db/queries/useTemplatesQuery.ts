import { useMemo } from "react"
import { useExpoQuery } from "../expo/useExpoQuery"
import { useDB } from "../useDB"

export const useTemplatesQuery = () => {
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
    })
  }, [drizzleDB])

  return useExpoQuery(query, ["workouts", "workout_steps", "sets"])
}
