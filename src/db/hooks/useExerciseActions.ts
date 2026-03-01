import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Fuse from "fuse.js"
import { addRecord, removeRecord, updateRecord } from "../cacheUtils"
import { ExerciseModel } from "../models/ExerciseModel"
import type { Set, Workout, WorkoutStep, WorkoutStepExercise } from "../schema"
import { useDatabaseService } from "../useDB"

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
    onSuccess: (inserted) => {
      queryClient.setQueriesData<ExerciseModel[]>({ queryKey: ["exercises"] }, (oldData) =>
        Array.isArray(oldData) ? addRecord(oldData, inserted) : oldData,
      )
    },
  })
}

export function useUpdateExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "exercises.update" },
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Omit<Partial<ExerciseModel>, "id" | "createdAt" | "updatedAt">
      date?: number
    }) => {
      return db.updateExercise(id, updates)
    },
    onSuccess: (updatedExerciseRows, variables) => {
      const row = updatedExerciseRows[0]
      if (row) {
        queryClient.setQueryData(["exercises", variables.id], new ExerciseModel(row))

        queryClient.setQueriesData<(typeof row)[]>({ queryKey: ["exercises"] }, (oldData) =>
          Array.isArray(oldData) ? updateRecord(oldData, variables.id, row) : oldData,
        )

        if ("isFavorite" in variables.updates) {
          queryClient.setQueriesData<(typeof row)[]>(
            {
              queryKey: ["exercises"],
              predicate: (q) => !!(q.queryKey[1] as ExerciseFilters)?.isFavorite,
            },
            (oldData) =>
              Array.isArray(oldData)
                ? row.is_favorite
                  ? addRecord(oldData, row)
                  : removeRecord(oldData, row.id)
                : oldData,
          )
        }
      }
      // Invalidate workout queries since they include embedded exercise data
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
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
      queryClient.setQueryData(["exercises", variables.id], null)
      queryClient.setQueriesData<ExerciseModel[]>({ queryKey: ["exercises"] }, (oldData) =>
        Array.isArray(oldData) ? removeRecord(oldData, variables.id) : oldData,
      )

      queryClient.setQueriesData({ queryKey: ["workouts", "by-date"] }, (oldData) =>
        removeExerciseFromWorkoutCache(oldData, variables.id),
      )
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
    refetchOnMount: false,
    select: (data) => {
      if (filters?.search && filters.search.trim()) {
        const fuse = new Fuse(data, {
          keys: ["name"],
          threshold: 0.2, // Very strict: 0 = exact match, 1 = match anything
          ignoreLocation: true,
          minMatchCharLength: 2,
        })

        return fuse.search(filters.search).map((result) => result.item)
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
    refetchOnMount: false,
    select: (data) => {
      if (filters?.search && filters.search.trim()) {
        const fuse = new Fuse(data, {
          keys: ["name"],
          threshold: 0.2, // Very strict: 0 = exact match, 1 = match anything
          ignoreLocation: true,
          minMatchCharLength: 2,
        })

        return fuse.search(filters.search).map((result) => result.item)
      }

      return data
    },
    meta: { op: "exercises.listMostUsed" },
  })
}

type WorkoutStepWithRelations = WorkoutStep & {
  sets?: Set[]
  workoutStepExercises?: WorkoutStepExercise[]
}

function removeExerciseFromWorkoutCache(oldData: unknown, exerciseId: number): unknown {
  if (!oldData || typeof oldData !== "object") return oldData

  const workout = oldData as Workout & { workoutSteps: WorkoutStepWithRelations[] }
  if (!Array.isArray(workout.workoutSteps)) return oldData

  const nextSteps = workout.workoutSteps
    .filter((step) => {
      if (step.step_type === "plain") {
        return !step.workoutStepExercises?.some((wse) => wse.exercise_id === exerciseId)
      }
      return true
    })
    .map((step) => {
      if (step.step_type === "plain") return step

      return {
        ...step,
        sets: (step.sets ?? []).filter((set) => set.exercise_id !== exerciseId),
        workoutStepExercises: (step.workoutStepExercises ?? []).filter(
          (wse) => wse.exercise_id !== exerciseId,
        ),
      }
    })

  return { ...workout, workoutSteps: nextSteps }
}
