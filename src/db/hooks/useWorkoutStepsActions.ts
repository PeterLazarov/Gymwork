import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ExerciseModel } from "../models/ExerciseModel"
import type { SetModel } from "../models/SetModel"
import { useDatabaseService } from "../useDB"
import { useInsertWorkout } from "./useWorkoutsActions"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutStep } from "../schema"
import { removeRecord } from "../cacheUtils"

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
    mutationFn: (params: InsertWorkoutStepParams & { date?: number }) => db.insertWorkoutStep(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
      variables.exercises.forEach(ex => {
        if (ex.id) queryClient.invalidateQueries({ queryKey: ["exercises", ex.id] })
      })
    },
  })
}

export function useRemoveWorkoutStep() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workoutSteps.delete" },
    mutationFn: ({ workoutStepId }: { workoutStepId: number; date?: number; exerciseIds?: number[] }) => 
      db.removeWorkoutStep(workoutStepId),
    onSuccess: (_, variables) => {
      if (variables.date) {
        // TODO: fix TS error
        queryClient.setQueryData(["workouts", "by-date", variables.date], (data) => removeStepFromWorkout(data, variables.workoutStepId))
      }
      // TODO: Protect exercise queries cache
      if (variables.exerciseIds) {
        variables.exerciseIds.forEach(id => {
          queryClient.invalidateQueries({ queryKey: ["exercises", id] })
        })
      }
    },
  })
}

export function useUpdateWorkoutStepExercise() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workoutSteps.updateExercise" },
    mutationFn: ({ 
      workoutStepId, 
      oldExerciseId, 
      exerciseId
    }: { 
      workoutStepId: number; 
      oldExerciseId: number; 
      exerciseId: number;
      date?: number;
    }) =>
      db.updateWorkoutStepExercise(workoutStepId, oldExerciseId, exerciseId),
    onSuccess: (_, variables) => {
      // TODO: Protect queries cache
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.oldExerciseId] })
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.exerciseId] })
    },
  })
}

export function useReorderWorkoutSteps() {
  const db = useDatabaseService()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { op: "workoutSteps.reorder" },
    mutationFn: ({ workoutId, from, to }: { workoutId: number; from: number; to: number; date?: number }) =>
      db.reorderWorkoutSteps(workoutId, from, to),
    onSuccess: (_, variables) => {
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
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
      date?: number
    }) => db.reorderWorkoutStepSets(workoutStepId, orderedSetIds),
    onSuccess: (_, variables) => {
      if (variables.date) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", variables.date] })
      }
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"], refetchType: "none" })
      if (openedDateMs) {
        queryClient.invalidateQueries({ queryKey: ["workouts", "by-date", openedDateMs] })
      }
      variables.forEach(ex => {
        if (ex.id) queryClient.invalidateQueries({ queryKey: ["exercises", ex.id] })
      })
    },
  })
}

function removeStepFromWorkout(
  oldData: unknown,
  stepId: number,
): unknown {
  if (!oldData || typeof oldData !== 'object') return oldData;
  
  const workout = oldData as { workoutSteps?: WorkoutStep[] };
  if (!workout.workoutSteps || !Array.isArray(workout.workoutSteps)) return oldData;
  
  return {
    ...workout,
    workoutSteps: removeRecord(workout.workoutSteps, stepId)
  };
}
