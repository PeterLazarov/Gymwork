import { isoDateToMs } from "@/utils"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { InfiniteData } from "@tanstack/react-query"
import { addRecord, removeRecord } from "../cacheUtils"
import { WorkoutModel } from "../models/WorkoutModel"
import type { DatabaseService } from "../services/DatabaseService"
import { useDatabaseService } from "../useDB"

export type WorkoutFilters = {
  dateFrom?: string
  dateTo?: string
  limit?: number
  discomfortLevel?: string
  muscleArea?: string
  muscle?: string
  offset?: number
}

export function useAllWorkoutIds(params?: { limit?: number }) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["workouts", "ids", params],
    queryFn: () => db.getAllWorkoutIds(params),
    meta: { op: "workouts.listIds" },
  })
}

export const WORKOUTS_PAGE_SIZE = 5
export function useAllWorkoutsFull(filters?: WorkoutFilters, search?: string) {
  const db = useDatabaseService()
  const combinedFilter = {
    ...filters,
    dateFrom: filters?.dateFrom ? isoDateToMs(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? isoDateToMs(filters.dateTo) : undefined,
    search,
    limit: WORKOUTS_PAGE_SIZE,
  }

  return useInfiniteQuery({
    queryKey: ["workouts", "full", combinedFilter],
    queryFn: async ({ pageParam = 0 }) =>
      (await db.getAllWorkoutsFull({ ...combinedFilter, offset: pageParam })) ?? [],
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < WORKOUTS_PAGE_SIZE) return undefined
      return allPages.length * WORKOUTS_PAGE_SIZE
    },
    meta: { op: "workouts.listFull" },
  })
}

export function useWorkoutsCount(filters?: WorkoutFilters, search?: string) {
  const db = useDatabaseService()
  const combinedFilter = {
    ...filters,
    dateFrom: filters?.dateFrom ? isoDateToMs(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? isoDateToMs(filters.dateTo) : undefined,
    search,
  }

  return useQuery({
    queryKey: ["workouts", "count", combinedFilter],
    queryFn: () => db.getWorkoutsCount(combinedFilter),
    meta: { op: "workouts.count" },
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      // Dated workouts need immediate refetch since Workout screen is already mounted
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
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
      date?: number | null
    }) => db.updateWorkout(workoutId, workout, overwriteSteps),
    onSuccess: ([updatedWorkout], variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      
      const workoutDate = variables.date ?? variables.workout.date

      if (variables.overwriteSteps) {
        if (workoutDate) {
          queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", workoutDate] })
        }
        if (variables.workout.isTemplate) {
          queryClient.invalidateQueries({ queryKey: ["workouts", "templates"] })
        }
        return
      }

      if (workoutDate && updatedWorkout) {
        queryClient.setQueryData(
          ["workouts", "by-date", workoutDate],
          (oldData: any) => oldData ? { ...oldData, ...updatedWorkout } : oldData
        )
      }
      
      if (variables.workout.isTemplate && updatedWorkout) {
        queryClient.setQueryData(
          ["workouts", "templates"],
          (oldData: any) => oldData?.map((template: any) =>
            template.id === variables.workoutId
              ? { ...template, ...updatedWorkout }
              : template
          ) ?? oldData
        )
      }
    },
  })
}

export function useRemoveWorkout() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workouts.delete" },
    mutationFn: ({ workoutId }: { workoutId: number; date?: number | null }) =>
      db.removeWorkout(workoutId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      } else {
        queryClient.setQueryData<WorkoutModel[]>(["workouts", "templates"], (oldData) =>
          removeRecord(oldData, variables.workoutId),
        )
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
      copySets,
    }: {
      sourceWorkout: WorkoutModel
      targetDate: number
      copySets: boolean
    }) => db.copyWorkout(sourceWorkout, targetDate, copySets),
    onSuccess: (copiedRecord, variables) => {
      if (!copiedRecord) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.targetDate] })
        return
      }

      queryClient.setQueryData(["workouts", "by-date", variables.targetDate], copiedRecord)

      queryClient.setQueriesData<WorkoutIdEntry[]>(
        { queryKey: ["workouts", "ids"] },
        (oldData) => {
          if (!Array.isArray(oldData)) return oldData
          const entry: WorkoutIdEntry = { id: copiedRecord.id, date: copiedRecord.date }
          return [...oldData, entry]
        },
      )

      queryClient.setQueriesData<InfiniteData<WorkoutsFullPage>>(
        { queryKey: ["workouts", "full"] },
        (oldData) => {
          if (!oldData) return oldData
          const [firstPage = [], ...rest] = oldData.pages
          return { ...oldData, pages: [addRecord(firstPage, copiedRecord), ...rest] }
        },
      )

      queryClient.setQueriesData<number>({ queryKey: ["workouts", "count"] }, (oldData) =>
        typeof oldData === "number" ? oldData + 1 : oldData,
      )
    },
  })
}

type WorkoutsFullPage = Awaited<ReturnType<DatabaseService["getAllWorkoutsFull"]>>
type WorkoutIdEntry = Awaited<ReturnType<DatabaseService["getAllWorkoutIds"]>>[number]
