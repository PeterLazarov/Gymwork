import { useDB } from "../useDB"

export const useWorkoutFullQuery = (openedDateMs: number) => {
  const { drizzleDB } = useDB()
  return () =>
    drizzleDB.query.workouts.findFirst({
      where: (workouts, { and, eq }) =>
        and(eq(workouts.date, openedDateMs), eq(workouts.is_template, false)),
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
