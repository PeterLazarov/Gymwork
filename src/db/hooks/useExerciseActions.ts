import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Exercise } from "../schema"
import { useDatabaseService } from "../useDB"
import { ExerciseModel } from "../models/ExerciseModel"

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
    select: (data) => {
      return data
        .map((workout) => ({
          ...workout,
          workoutSteps: workout.workoutSteps
            .filter((step) => step.sets.some((set) => set.exercise_id === exerciseId))
            .map((step) => ({
              ...step,
              sets: step.sets.filter((set) => set.exercise_id === exerciseId),
            })),
        }))
        .filter((workout) => workout.workoutSteps.length > 0)
    },
  })
}

export function useExerciseLastSet(exerciseId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId, "last-set"],
    queryFn: async () => (await db.getExerciseLastSet(exerciseId)) ?? null,
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
    mutationFn: async (exercise: Omit<Exercise, "id" | "created_at" | "updated_at">) => {
      const [inserted] = await db.insertExercise(exercise)
      return new ExerciseModel(inserted)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
    },
  })
}

export function useUpdateExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<ExerciseModel> }) => {
      const data = {
        ...updates,
        muscles: updates.muscles?.map((m) => m.toString()) ?? [],
        muscleAreas: updates.muscleAreas?.map((m) => m.toString()) ?? [],
        metrics: updates.metrics,
      }
      return db.updateExercise(id, data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] })
      // Invalidate workout queries since they include exercise data with metrics
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export type ExerciseFilters = {
  isFavorite?: boolean
  search?: string
  muscleArea?: string
  muscle?: string
  equipment?: string
}

export function useExercises(filters?: ExerciseFilters) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => db.getExercises(filters),
  })
}

export function useMostUsedExercises(limit: number, filters: ExerciseFilters) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", "most-used", { limit, filters }],
    queryFn: async () => {
      const result = await db.getMostUsedExercises(limit, filters)
      return result.map((r) => r.exercise)
    },
  })
}
