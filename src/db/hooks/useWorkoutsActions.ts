import { isoDateToMs } from "@/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { WorkoutModel } from "../models/WorkoutModel"
import { useDatabaseService } from "../useDB"
import { removeRecord } from "../cacheUtils"

export type WorkoutFilters = {
  dateFrom?: string
  dateTo?: string
  limit?: number
  discomfortLevel?: string
  muscleArea?: string
  muscle?: string
}

export function useAllWorkoutIds(params?: { limit?: number }) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["workouts", "ids", params],
    queryFn: () => db.getAllWorkoutIds(params),
    meta: { op: "workouts.listIds" },
  })
}

export function useAllWorkoutsFull(filters?: WorkoutFilters, search?: string) {
  const db = useDatabaseService()
  const combinedFilter = {
    ...filters,
    dateFrom: filters?.dateFrom ? isoDateToMs(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? isoDateToMs(filters.dateTo) : undefined,
    search,
  }

  return useQuery({
    queryKey: ["workouts", "full", combinedFilter],
    queryFn: async () => (await db.getAllWorkoutsFull(combinedFilter)) ?? null,
    meta: { op: "workouts.listFull" },
  })
}

export function useWorkoutByDate(dateMs: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["workouts", "by-date", dateMs],
    queryFn: async () => (await db.getWorkoutByDate(dateMs)) ?? null,
    meta: { op: "workouts.getByDate" },
  })
}

export function useTemplates() {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["workouts", "templates"],
    queryFn: () => db.getTemplates(),
    meta: { op: "workouts.listTemplates" },
  })
}

export function useInsertWorkout() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workouts.create" },
    mutationFn: (workout: Partial<WorkoutModel>) => db.insertWorkout(workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useUpdateWorkout() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workouts.update" },
    mutationFn: ({
      workoutId,
      workout,
      overwriteSteps,
    }: {
      workoutId: number
      workout: Partial<WorkoutModel>
      overwriteSteps?: boolean
    }) => db.updateWorkout(workoutId, workout, overwriteSteps),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      if (variables.workout.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.workout.date] })
      }
    },
  })
}

export function useRemoveWorkout() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workouts.delete" },
    mutationFn: ({ workoutId }: { workoutId: number, date?: number | null }) => db.removeWorkout(workoutId),
    onSuccess: (_, variables) => {
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
      else {
        // TODO: fix ts error
        queryClient.setQueryData(["workouts", "templates"] , oldData => removeRecord(oldData, variables.workoutId))
      }
    },
  })
}

export function useCopyWorkout() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workouts.copy" },
    mutationFn: ({
      sourceWorkout,
      targetDate,
      copySets
    }: {
      sourceWorkout: WorkoutModel
      targetDate: number
      copySets: boolean
    }) => db.copyWorkout(sourceWorkout, targetDate, copySets),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.targetDate] })
    },
  })
}
