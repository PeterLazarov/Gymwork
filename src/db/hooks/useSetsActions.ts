import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { removeRecord, updateQueryItems } from "../cacheUtils"
import type { SetModel } from "../models/SetModel"
import { ExerciseModel } from "../models/ExerciseModel"
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
      if (variables.set.date && variables.set.workoutStepId && variables.set.exercise) {
        queryClient.setQueryData(
          ["workouts", "by-date", variables.set.date],
          (oldData) =>
            addSetToWorkoutByDateCache(
              oldData,
              inserted,
              variables.set.workoutStepId!,
              variables.set.exercise as ExerciseModel,
            ),
        )
      }
      queryClient.invalidateQueries({ queryKey: ["exercises", "most-used"], refetchType: "none" })

      if (variables.set.exerciseId) {
        updateQueryItems(
          queryClient,
          ["exercises", variables.set.exerciseId, "workouts"],
          (query) => {
            const data = query.state.data
            if (!Array.isArray(data)) return false
            return data.some((workout) => {
              if (!workout || typeof workout !== "object") return false
              return (workout as { date?: number | null }).date === inserted.date
            })
          },
          (query) => 
            addSetToExerciseHistoryCache(
              query.state.data,
              inserted,
              variables.set.exercise,
            ),
        )
      }

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

function addSetToExerciseHistoryCache(
  oldData: unknown,
  inserted: Set,
  exercise?: ExerciseModel,
): unknown | undefined {
  if (!Array.isArray(oldData) || !exercise) return undefined

  const workout = oldData.find((item) => {
    if (!item || typeof item !== "object") return false
    return (item as { date?: number | null }).date === inserted.date
  })

  const step = workout?.workoutSteps?.find((s: WorkoutStep) => s.id === inserted.workout_step_id)
  const existingSets = step?.sets ?? []
  const canUpdate =
    workout && Array.isArray(workout.workoutSteps) && step && !existingSets.some((s: Set) => s.id === inserted.id)

  if (!canUpdate) return undefined

  const exerciseRaw = { ...exercise.toRawModel(), exerciseMetrics: exercise.metrics }
  const newSet = exerciseRaw ? { ...inserted, exercise: exerciseRaw } : inserted
  const nextStep = { ...step!, sets: [...existingSets, newSet] }
  const nextSteps = workout!.workoutSteps!.map((s: WorkoutStep) =>
    s.id === inserted.workout_step_id ? nextStep : s,
  )

  return oldData.map((w) => {
    if (!w || typeof w !== "object") return w
    return (w as { date?: number | null }).date === workout!.date
      ? { ...workout!, workoutSteps: nextSteps }
      : w
  })
}

function addSetToWorkoutByDateCache(
  oldData: unknown,
  inserted: Set,
  workoutStepId: number,
  exercise: ExerciseModel,
): unknown {
  if (!oldData || typeof oldData !== "object") return oldData
  const workout = oldData as { workoutSteps?: (WorkoutStep & { sets?: Set[] })[] }
  if (!Array.isArray(workout.workoutSteps)) return oldData

  const stepIndex = workout.workoutSteps.findIndex((step) => step.id === workoutStepId)
  if (stepIndex === -1) return oldData

  const step = workout.workoutSteps[stepIndex]
  const existingSets = step.sets ?? []
  if (existingSets.some((set) => set.id === inserted.id)) return oldData

  const newSet = { ...inserted, exercise: exercise.toRawModel() }
  const nextStep = { ...step, sets: [...existingSets, newSet] }
  const nextSteps = [...workout.workoutSteps]
  nextSteps[stepIndex] = nextStep

  return { ...workout, workoutSteps: nextSteps }
}
