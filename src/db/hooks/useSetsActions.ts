import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { removeRecord, updateQueryItems } from "../cacheUtils"
import { ExerciseModel } from "../models/ExerciseModel"
import type { SetModel } from "../models/SetModel"
import { Set, Workout, WorkoutStep } from "../schema"
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
        queryClient.setQueryData(["workouts", "by-date", variables.set.date], (oldData) =>
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
        const workoutByDate = queryClient.getQueryData(["workouts", "by-date", variables.set.date])

        updateQueryItems(
          queryClient,
          ["exercises", variables.set.exerciseId, "workouts"],
          (query) => Array.isArray(query.state.data),
          (query) =>
            addSetToExerciseHistoryCache(
              query.state.data,
              inserted,
              variables.set.exercise,
              workoutByDate,
            ),
        )

        const lastSetKey = ["exercises", variables.set.exerciseId, "last-set"]
        const currentLastSet = queryClient.getQueryData<{ date: number } | null>(lastSetKey)
        if (currentLastSet === null || (currentLastSet && inserted.date >= currentLastSet.date)) {
          queryClient.setQueryData(
            lastSetKey,
            currentLastSet ? { ...currentLastSet, ...inserted } : inserted,
          )
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

type WorkoutStepWithSets = WorkoutStep & { sets?: Set[] }
type WorkoutCacheEntry = Workout & { workoutSteps: WorkoutStepWithSets[] }

function removeSetFromWorkout(oldData: unknown, stepId: number, setId: number): unknown {
  if (!oldData || typeof oldData !== "object") return oldData

  const workout = oldData as WorkoutCacheEntry
  if (!Array.isArray(workout.workoutSteps)) return oldData

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
  exercise: ExerciseModel | undefined,
  workoutByDate: unknown,
): unknown {
  if (!Array.isArray(oldData) || !exercise) return undefined

  const exerciseRaw = { ...exercise.toRawModel(), exerciseMetrics: exercise.metrics }
  const newSet = { ...inserted, exercise: exerciseRaw }

  const workout = oldData.find((item) => {
    if (!item || typeof item !== "object") return false
    return (item as WorkoutCacheEntry).date === inserted.date
  }) as WorkoutCacheEntry | undefined

  if (workout && Array.isArray(workout.workoutSteps)) {
    const step = workout.workoutSteps.find((s) => s.id === inserted.workout_step_id)

    if (step) {
      const existingSets = step.sets ?? []
      if (existingSets.some((s: Set) => s.id === inserted.id)) return undefined

      const nextStep = { ...step, sets: [...existingSets, newSet] }
      const nextSteps = workout.workoutSteps.map((s) =>
        s.id === inserted.workout_step_id ? nextStep : s,
      )
      return replaceWorkoutInList(oldData, workout.date, { ...workout, workoutSteps: nextSteps })
    }
  }

  const byDateStep = findStepInByDateCache(workoutByDate, inserted.workout_step_id)
  if (!byDateStep) return undefined
  const newStep = { ...byDateStep, sets: [newSet] }

  if (workout && Array.isArray(workout.workoutSteps)) {
    return replaceWorkoutInList(oldData, workout.date, {
      ...workout,
      workoutSteps: [...workout.workoutSteps, newStep],
    })
  }

  const byDateWorkout = workoutByDate as WorkoutCacheEntry
  return [{ ...byDateWorkout, workoutSteps: [newStep] }, ...oldData]
}

function replaceWorkoutInList(
  list: unknown[],
  date: number | null,
  replacement: WorkoutCacheEntry,
): unknown[] {
  return list.map((w) => ((w as WorkoutCacheEntry)?.date === date ? replacement : w))
}

function findStepInByDateCache(
  workoutByDate: unknown,
  stepId: number,
): WorkoutStepWithSets | undefined {
  if (!workoutByDate || typeof workoutByDate !== "object") return undefined
  const workout = workoutByDate as WorkoutCacheEntry
  return workout.workoutSteps?.find((s) => s.id === stepId)
}

function addSetToWorkoutByDateCache(
  oldData: unknown,
  inserted: Set,
  workoutStepId: number,
  exercise: ExerciseModel,
): unknown {
  if (!oldData || typeof oldData !== "object") return oldData
  const workout = oldData as WorkoutCacheEntry
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
