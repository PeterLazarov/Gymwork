import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { removeRecord } from "../cacheUtils"
import type { SetModel } from "../models/SetModel"
import { Set, WorkoutStep } from "../schema"
import { useDatabaseService } from "../useDB"

export function useRecords(workoutStepId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["sets", "records", workoutStepId],
    queryFn: () => db.getRecords(workoutStepId),
    meta: { op: "sets.getRecords" },
  })
}

export function useInsertSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "sets.create" },
    mutationFn: ({
      set,
      manualCompletion,
    }: {
      set: Partial<SetModel>
      manualCompletion?: boolean
    }) => db.insertSet(set, manualCompletion),
    onSuccess: ([inserted], variables) => {
      if (variables.set.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.set.date] })
      }
      queryClient.invalidateQueries({ queryKey: ["exercises", "most-used"], refetchType: "none" })

      if (variables.set.exerciseId) {
        const lastSetKey = ["exercises", variables.set.exerciseId, "last-set"]
        const currentLastSet = queryClient.getQueryData<{ date: number }>(lastSetKey)
        if (currentLastSet && inserted.date >= currentLastSet.date) {
          queryClient.setQueryData(lastSetKey, { ...currentLastSet, ...inserted })
        }
      }
    },
  })
}

export function useUpdateSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "sets.update" },
    mutationFn: ({
      setId,
      updates,
    }: {
      setId: number
      updates: Partial<SetModel>
      date?: number
    }) => db.updateSet(setId, updates),
    onSuccess: (_, variables) => {
      // Mark lists as stale but don't refetch immediately
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises"], refetchType: "none" })

      // Targeted invalidation - use explicit date param or fall back to updates.date
      const workoutDate = variables.date ?? variables.updates.date
      if (workoutDate) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", workoutDate] })
      }

      queryClient.invalidateQueries({ queryKey: ["sets"], refetchType: "none" })
    },
  })
}

export function useRemoveSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "sets.delete" },
    mutationFn: ({
      id,
    }: {
      id: number
      date?: number
      exerciseId?: number
      stepId: number
      isRecord?: boolean
    }) => db.removeSet(id),
    onSuccess: (_, variables) => {
      // Global lists -> Stale
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises", "most-used"], refetchType: "none" })

      // Targeted
      if (variables.date) {
        queryClient.setQueriesData(
          { queryKey: ["workouts", "by-date", variables.date] },
          (oldData) => removeSetFromWorkout(oldData, variables.stepId, variables.id),
        )
      }

      queryClient.setQueriesData<SetModel[]>({ queryKey: ["sets"] }, (oldData) =>
        removeRecord(oldData, variables.id),
      )
      // Recalculate records only if deleted set was a record
      if (variables.isRecord) {
        queryClient.invalidateQueries({ queryKey: ["sets", "records", variables.stepId] })
      }
    },
  })
}

function removeSetFromWorkout(oldData: unknown, stepId: number, setId: number): unknown {
  if (!oldData || typeof oldData !== "object") return oldData

  const workout = oldData as { workoutSteps?: (WorkoutStep & { sets: Set[] })[] }
  if (!workout.workoutSteps || !Array.isArray(workout.workoutSteps)) return oldData

  return {
    ...workout,
    workoutSteps: workout.workoutSteps.map((step) =>
      step.id === stepId ? { ...step, sets: removeRecord(step.sets, setId) } : step,
    ),
  }
}
