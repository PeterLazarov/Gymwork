import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ExerciseModel } from "../models/ExerciseModel"
import type { SetModel } from "../models/SetModel"
import { useDatabaseService } from "../useDB"
import { useInsertWorkout } from "./useWorkoutsActions"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"

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
    meta: { op: "workoutSteps.create" },
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
    meta: { op: "workoutSteps.delete" },
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
    meta: { op: "workoutSteps.updateExercise" },
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
    meta: { op: "workoutSteps.reorder" },
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
    meta: { op: "workoutSteps.reorderSets" },
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



export function useCreateExercisesStep() {
  const db = useDatabaseService()
  const { openedWorkout, openedDateMs } = useOpenedWorkout()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workoutSteps.createFromExercises" },
    mutationFn: async (exercises: ExerciseModel[]) => {
      let workoutId = openedWorkout?.id
      if (!workoutId) {
        const result = await db.insertWorkout({ date: openedDateMs })
        workoutId = result[0].id
      }

      await db.insertWorkoutStep({ exercises, workoutId })

      return workoutId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}


