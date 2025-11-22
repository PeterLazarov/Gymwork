import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Exercise } from "../schema"
import { useDatabaseService } from "../useDB"

export function useExercise(exerciseId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId],
    queryFn: () => db.getExercise(exerciseId),
  })
}

export function useWorkoutsForExercise(
  exerciseId: number,
  filters?: { startDate?: number; endDate?: number; limit?: number },
) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId, "workouts", filters],
    queryFn: () => db.getWorkoutsForExercise(exerciseId, filters),
  })
}

export function useExerciseLastSet(exerciseId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId, "last-set"],
    queryFn: () => db.getExerciseLastSet(exerciseId),
  })
}

export function useExerciseRecords(exerciseId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId, "records"],
    queryFn: () => db.getExerciseRecords(exerciseId),
  })
}

export function useInsertExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (exercise: Omit<Exercise, "id" | "created_at" | "updated_at">) =>
      db.insertExercise(exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
    },
  })
}

export function useUpdateExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Exercise> }) =>
      db.updateExercise(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] })
    },
  })
}

type ExerciseFilters = {
  isFavorite?: boolean
  search?: string
}

export function useExercises(filters?: ExerciseFilters) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => db.getExercises(filters),
  })
}

export function useMostUsedExercises(limit: number, search?: string) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", "most-used", { limit, search }],
    queryFn: async () => {
      const result = await db.getMostUsedExercises(limit, search)
      return result.map((r) => r.exercise)
    },
  })
}
