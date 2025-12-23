import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SetModel } from "../models/SetModel"
import { useDatabaseService } from "../useDB"

export function useRecords(workoutStepId: number) {
  const db = useDatabaseService()

  return useQuery({
    queryKey: ["sets", "records", workoutStepId],
    queryFn: () => db.getRecords(workoutStepId),
  })
}

export function useInsertSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      set,
      manualCompletion,
    }: {
      set: Partial<SetModel>
      manualCompletion?: boolean
    }) => db.insertSet(set),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["sets"] })
    },
  })
}

export function useUpdateSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ setId, updates }: { setId: number; updates: Partial<SetModel> }) =>
      db.updateSet(setId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["sets"] })
    },
  })
}

export function useRemoveSet() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (setId: number) => db.removeSet(setId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      queryClient.invalidateQueries({ queryKey: ["sets"] })
    },
  })
}
