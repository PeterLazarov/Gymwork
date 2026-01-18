import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SetModel } from "../models/SetModel"
import { useDatabaseService } from "../useDB"
import { addRecord, removeRecord } from "../cacheUtils"
import { WorkoutStep, Set } from "../schema"

export function useRecords(workoutStepId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["sets", "records", workoutStepId],
    queryFn: () => db.getRecords(workoutStepId),
    meta: { op: "sets.getRecords" },
  })
}

// TODO: Protect cache
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
      if (variables.set.exerciseId) {
        queryClient.invalidateQueries({ queryKey: ["exercises", "most-used", variables.set.exerciseId], refetchType: "none" })
      }
    },
  })
}

// TODO: Protect cache
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
    mutationFn: ({ id }: { id: number; date?: number; exerciseId?: number, stepId: number }) => 
      db.removeSet(id),
    onSuccess: (_, variables) => {
      // Global lists -> Stale
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      queryClient.invalidateQueries({ queryKey: ["exercises"], refetchType: "none" })
      
      // Targeted
      if (variables.date) {
        queryClient.setQueriesData({ queryKey: ["workouts", "by-date", variables.date] }, oldData => removeSetFromWorkout(oldData, variables.stepId, variables.id))
      }
      if (variables.exerciseId) {
        queryClient.invalidateQueries({ queryKey: ["exercises", variables.exerciseId] })
      }

      queryClient.setQueriesData({ queryKey: ["sets"] }, oldData => removeRecord(oldData, variables.id))
    },
  })
}

function removeSetFromWorkout(
  oldData: unknown,
  stepId: number,
  setId: number
): unknown {
  if (!oldData || typeof oldData !== 'object') return oldData;
  
  const workout = oldData as { workoutSteps?: (WorkoutStep & { sets: Set[] })[] };
  if (!workout.workoutSteps || !Array.isArray(workout.workoutSteps)) return oldData;
  
  return {
    ...workout,
    workoutSteps: workout.workoutSteps.map(step => 
      step.id === stepId
        ? { ...step, sets: removeRecord(step.sets, setId) }
        : step
    )
  };
}
