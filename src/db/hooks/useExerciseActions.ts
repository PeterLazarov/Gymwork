import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Fuse from "fuse.js"
import type { Exercise } from "../schema"
import { useDatabaseService } from "../useDB"
import { ExerciseModel } from "../models/ExerciseModel"

export function useExercise(exerciseId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId],
    queryFn: () => db.getExercise(exerciseId),
    meta: { op: "exercises.get" },
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
    meta: { op: "exercises.getWorkouts" },
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
    meta: { op: "exercises.getLastSet" },
  })
}

export function useExerciseRecords(exerciseId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["exercises", exerciseId, "records"],
    queryFn: () => db.getExerciseRecords(exerciseId),
    meta: { op: "exercises.getRecords" },
  })
}

export function useInsertExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "exercises.create" },
    mutationFn: async (exercise: Omit<ExerciseModel, "id" | "createdAt" | "updatedAt">) => {
      const inserted = await db.insertExercise(exercise)
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
    meta: { op: "exercises.update" },
    mutationFn: ({ id, updates }: { id: number; updates: Omit<Partial<ExerciseModel>, "id" | "createdAt" | "updatedAt"> }) => {
      return db.updateExercise(id, updates)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] })
      // Invalidate workout queries since they include exercise data with metrics
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}


export function useDeleteExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "exercises.delete" },
    mutationFn: ({ id }: { id: number }) => {
      return db.deleteExercise(id)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] })
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
    select: (data) => {
      if (filters?.search && filters.search.trim()) {
        const fuse = new Fuse(data, {
          keys: ["name"],
          threshold: 0.2, // Very strict: 0 = exact match, 1 = match anything
          ignoreLocation: true,
          minMatchCharLength: 2,
        })
        
        return fuse.search(filters.search).map(result => result.item)
      }
      
      return data
    },
    meta: { op: "exercises.list" },
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
    select: (data) => {
      if (filters?.search && filters.search.trim()) {
        const fuse = new Fuse(data, {
          keys: ["name"],
          threshold: 0.2, // Very strict: 0 = exact match, 1 = match anything
          ignoreLocation: true,
          minMatchCharLength: 2,
        })
        
        return fuse.search(filters.search).map(result => result.item)
      }
      
      return data
    },
    meta: { op: "exercises.listMostUsed" },
  })
}
