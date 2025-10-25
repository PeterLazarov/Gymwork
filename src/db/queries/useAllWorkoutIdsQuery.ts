import { useDB } from "../useDB"

export type WorkoutResult = {
  id: number
  date: number
}

export const useAllWorkoutsQuery = () => {
  const { drizzleDB } = useDB()
  return () =>
    drizzleDB.query.workouts.findMany({
      columns: {
        id: true,
        date: true,
      },
      orderBy: (workouts, { asc }) => asc(workouts.date),
    }) as Promise<WorkoutResult[]>
}
