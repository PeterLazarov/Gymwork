import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SetModel } from "../models/SetModel"
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
    }) => db.insertSet(set),
    onSuccess: (_, variables) => {
      // Mark lists as stale but don't refetch immediately
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises"], refetchType: "none" })
      
      // Targeted invalidation
      if (variables.set.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.set.date] })
      }
      if (variables.set.exerciseId) {
        queryClient.invalidateQueries({ queryKey: ["exercises", variables.set.exerciseId] })
      }
      
      queryClient.invalidateQueries({ queryKey: ["sets"] })
    },
  })
}

export function useUpdateSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "sets.update" },
    mutationFn: ({ setId, updates }: { setId: number; updates: Partial<SetModel> }) =>
      db.updateSet(setId, updates),
    onSuccess: (_, variables) => {
      // Mark lists as stale but don't refetch immediately
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises"], refetchType: "none" })
      
      // Targeted invalidation
      if (variables.updates.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.updates.date] })
      }
      // Assuming we can't easily get exerciseId from updates alone usually, but if we did:
      // We'd rely on the "sets" invalidation to handle step tracks.
      // If we really need exercise details update, we rely on refetchType: 'none' global
      
      queryClient.invalidateQueries({ queryKey: ["sets"] })
    },
  })
}

export function useRemoveSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "sets.delete" },
    mutationFn: ({ id }: { id: number; date?: number; exerciseId?: number }) => 
      db.removeSet(id),
    onSuccess: (_, variables) => {
      // Global lists -> Stale
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises"], refetchType: "none" })
      
      // Targeted
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
      if (variables.exerciseId) {
        queryClient.invalidateQueries({ queryKey: ["exercises", variables.exerciseId] })
      }
      
      queryClient.invalidateQueries({ queryKey: ["sets"] })
    },
  })
}
