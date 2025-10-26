import { useDB } from "../useDB"

export const useTemplatesQuery = () => {
  const { drizzleDB } = useDB()
  return () =>
    drizzleDB.query.workouts.findMany({
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
}
