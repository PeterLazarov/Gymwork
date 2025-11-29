import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ExerciseModel } from "../models/ExerciseModel"
import type { SetModel } from "../models/SetModel"
import { useDatabaseService } from "../useDB"

type InsertWorkoutStepParams = {
  workoutId: number
  exercises: ExerciseModel[]
  sets?: SetModel[]
  stepData?: {
    id: number
    stepType: "plain" | "superset" | "circuit" | "emom" | "amrap" | "custom"
    position: number
    createdAt: number
    updatedAt: number
  }
}

export function useInsertWorkoutStep() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: InsertWorkoutStepParams) => db.insertWorkoutStep(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useRemoveWorkoutStep() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workoutStepId: number) => db.removeWorkoutStep(workoutStepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useUpdateWorkoutStepExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workoutStepId, oldExerciseId, exerciseId }: { workoutStepId: number; oldExerciseId: number; exerciseId: number }) =>
      db.updateWorkoutStepExercise(workoutStepId, oldExerciseId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useReorderWorkoutSteps() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workoutId, from, to }: { workoutId: number; from: number; to: number }) =>
      db.reorderWorkoutSteps(workoutId, from, to),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useReorderWorkoutStepSets() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workoutStepId,
      orderedSetIds,
    }: {
      workoutStepId: number
      orderedSetIds: number[]
    }) => db.reorderWorkoutStepSets(workoutStepId, orderedSetIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}
