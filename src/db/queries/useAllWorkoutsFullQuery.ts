import { FilterForm } from "@/components/WorkoutHistoryScreen/components/WorkoutsFilterModal"
import { useDB } from "../useDB"
import { isoDateToMs } from "@/utils"

export const useAllWorkoutsFullQuery = () => {
  const { drizzleDB } = useDB()
  return (filter: FilterForm, searchString: string) =>
    drizzleDB.query.workouts.findMany({
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
        const conditions = []
        
        if (filter.discomfortLevel) {
          conditions.push(eq(workouts.pain, filter.discomfortLevel)) 
        }
        if (filter.dateFrom) {

          conditions.push(gte(workouts.date, isoDateToMs(filter.dateFrom)))
        }
        if (filter.dateTo) {
          conditions.push(lte(workouts.date, isoDateToMs(filter.dateTo)))
        }

        if (searchString) {
          conditions.push(or(
            like(workouts.name, `%${searchString}%`)), 
            like(workouts.notes, `%${searchString}%`
          ))
        }

        if (conditions.length === 0) return undefined
        if (conditions.length === 1) return conditions[0]
        return and(...conditions)
      },
      orderBy: (workouts, { desc }) => desc(workouts.date),
    })
}
