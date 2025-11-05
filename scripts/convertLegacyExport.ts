import { sanitizeMsDate } from "@/utils/date"
import { DateTime } from "luxon"
import { readFile, writeFile } from "node:fs/promises"
import { basename, extname, resolve } from "node:path"

type MeasurementDetails = {
  unit?: string
  moreIsBetter?: boolean
  step?: number
  min?: number
  max?: number
}

type LegacyExercise = {
  guid: string
  name: string
  images?: string[]
  equipment?: string[]
  instructions?: string[]
  tips?: string[]
  muscleAreas?: string[]
  muscles?: string[]
  measurements?: Record<string, MeasurementDetails>
  isFavorite?: boolean
}

type LegacySet = {
  exercise: string
  isWarmup?: boolean
  date?: string
  isWeakAssRecord?: boolean
  reps?: number
  weightMcg?: number
  distanceMm?: number
  durationMs?: number
  restMs?: number
  createdAt?: number
  completedAt?: number
}

type LegacyWorkoutStep = {
  guid: string
  type?: string
  exercises?: string[]
  sets?: LegacySet[]
}

type LegacyWorkout = {
  guid: string
  name?: string
  notes?: string
  date?: string
  feeling?: string | null
  pain?: string | null
  rpe?: number | null
  endedAt?: number | null
  durationMs?: number | null
  steps?: LegacyWorkoutStep[]
}

type LegacyExport = {
  workoutStore: {
    workouts?: LegacyWorkout[]
    workoutTemplates?: LegacyWorkout[]
  }
  exerciseStore: {
    exercises: LegacyExercise[]
  }
}

type ConvertedExercise = {
  id: number
  name: string
  images: string[]
  equipment: string[]
  muscle_areas: string[]
  muscles: string[]
  instructions: string[]
  tips: string[]
  position: string | null
  stance: string | null
  is_favorite: boolean
  created_at: number
  updated_at: number
}

type ConvertedExerciseMetric = {
  id: number
  exercise_id: number
  measurement_type: string
  unit: string
  more_is_better: boolean
  step_value: number | null
  min_value: number | null
  max_value: number | null
  created_at: number
  updated_at: number
}

type ConvertedWorkout = {
  id: number
  name: string | null
  notes: string | null
  date: number | null
  feeling: string | null
  pain: string | null
  rpe: number | null
  ended_at: number | null
  duration_ms: number | null
  is_template: boolean
  created_at: number
  updated_at: number
}

type ConvertedWorkoutStep = {
  id: number
  workout_id: number
  step_type: string
  position: number
  created_at: number
  updated_at: number
}

type ConvertedWorkoutStepExercise = {
  id: number
  workout_step_id: number
  exercise_id: number
  created_at: number
  updated_at: number
}

type ConvertedSet = {
  id: number
  workout_step_id: number
  exercise_id: number
  is_warmup: boolean
  date: number | null
  is_weak_ass_record: boolean
  reps: number | null
  weight_mcg: number | null
  distance_mm: number | null
  duration_ms: number | null
  speed_kph: number | null
  rest_ms: number | null
  completed_at: number | null
  created_at: number
  updated_at: number
}

const measurementUnitMap: Record<string, string> = {
  weight: "kg",
  reps: "reps",
  duration: "ms",
  distance: "mm",
  speed: "kph",
}

const stepTypeMap: Record<string, string> = {
  straightSet: "plain",
  superSet: "superset",
}

type CLIOptions = {
  input: string
  output?: string
}

function parseArgs(argv: string[]): CLIOptions {
  const options: Partial<CLIOptions> = {}
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--input" && argv[i + 1]) {
      options.input = argv[i + 1]
      i += 1
    } else if (arg.startsWith("--input=")) {
      options.input = arg.split("=")[1]!
    } else if (arg === "--output" && argv[i + 1]) {
      options.output = argv[i + 1]
      i += 1
    } else if (arg.startsWith("--output=")) {
      options.output = arg.split("=")[1]!
    }
  }

  if (!options.input) {
    throw new Error("Missing required --input <path> argument")
  }

  return options as CLIOptions
}

function resolveOutputPath(inputPath: string, outputOverride?: string): string {
  if (outputOverride) {
    return resolve(outputOverride)
  }

  const base = basename(inputPath)
  const extension = extname(base)
  const withoutExt = base.slice(0, base.length - extension.length)
  const suggested = `${withoutExt || base}-converted${extension || ".json"}`
  return resolve(process.cwd(), suggested)
}

function convertDate(date: string | null | undefined): number | null {
  if (!date) {
    return null
  }
  // Parse date as local timezone midnight using DateTime
  // This matches how the app handles dates with DateTime.fromISO()
  const dateTime = DateTime.fromISO(date)
  if (!dateTime.isValid) {
    throw new Error(`Unable to parse date string: ${date}`)
  }
  const atMidnight = dateTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  return atMidnight.toMillis()
}

function toMilliseconds(value?: number | null): number | null {
  if (value === undefined || value === null) {
    return null
  }
  return Math.round(value * 1000)
}

function toMillimeters(value?: number | null, unit?: string): number | null {
  if (value === undefined || value === null) {
    return null
  }
  const multiplier = unit === "km" ? 1_000_000 : unit === "m" ? 1000 : 1
  return value * multiplier
}

function normalizeMeasurement(
  type: string,
  details: MeasurementDetails,
): Pick<ConvertedExerciseMetric, "step_value" | "min_value" | "max_value"> {
  let { step: stepValue = null, min: minValue = null, max: maxValue = null } = details

  if (type === "duration") {
    stepValue = toMilliseconds(stepValue)
    minValue = toMilliseconds(minValue)
    maxValue = toMilliseconds(maxValue)
  } else if (type === "distance") {
    const unit = details.unit || "m"
    stepValue = toMillimeters(stepValue, unit)
    minValue = toMillimeters(minValue, unit)
    maxValue = toMillimeters(maxValue, unit)
  }

  return {
    step_value: stepValue,
    min_value: minValue,
    max_value: maxValue,
  }
}

async function convertLegacyExport({ input, output }: { input: string; output: string }) {
  const inputPath = resolve(input)
  const outputPath = resolve(output)
  const raw = await readFile(inputPath, "utf-8")
  const legacy = JSON.parse(raw) as LegacyExport

  const now = Date.now()

  const exerciseIdMap = new Map<string, number>()
  const exercises: ConvertedExercise[] = []
  const exerciseMetrics: ConvertedExerciseMetric[] = []

  let nextExerciseId = 1
  let nextMetricId = 1

  for (const exercise of legacy.exerciseStore.exercises) {
    const exerciseId = nextExerciseId
    nextExerciseId += 1
    exerciseIdMap.set(exercise.guid, exerciseId)

    exercises.push({
      id: exerciseId,
      name: exercise.name,
      images: exercise.images ?? [],
      equipment: exercise.equipment ?? [],
      muscle_areas: exercise.muscleAreas ?? [],
      muscles: exercise.muscles ?? [],
      instructions: exercise.instructions ?? [],
      tips: exercise.tips ?? [],
      position: null,
      stance: null,
      is_favorite: Boolean(exercise.isFavorite),
      created_at: now,
      updated_at: now,
    })

    const measurements = exercise.measurements ?? {}
    for (const [measurementType, details] of Object.entries(measurements)) {
      const unit = measurementUnitMap[measurementType]
      if (!unit) {
        continue
      }

      const { step_value, min_value, max_value } = normalizeMeasurement(measurementType, details)

      exerciseMetrics.push({
        id: nextMetricId,
        exercise_id: exerciseId,
        measurement_type: measurementType,
        unit,
        more_is_better: details.moreIsBetter ?? true,
        step_value,
        min_value,
        max_value,
        created_at: now,
        updated_at: now,
      })
      nextMetricId += 1
    }
  }

  const workouts: ConvertedWorkout[] = []
  const workoutSteps: ConvertedWorkoutStep[] = []
  const workoutStepExercises: ConvertedWorkoutStepExercise[] = []
  const sets: ConvertedSet[] = []

  const missingExercises = new Set<string>()

  let nextWorkoutId = 1
  let nextStepId = 1
  let nextStepExerciseId = 1
  let nextSetId = 1

  function processWorkoutCollection(collection: LegacyWorkout[] | undefined, isTemplate: boolean) {
    if (!collection) {
      return
    }

    for (const workout of collection) {
      const workoutId = nextWorkoutId
      nextWorkoutId += 1

      const workoutDate = convertDate(workout.date)
      const workoutCreatedAt = workoutDate ?? now
      const workoutUpdatedAt = workout.endedAt ?? workoutCreatedAt

      workouts.push({
        id: workoutId,
        name: workout.name ?? null,
        notes: workout.notes ?? null,
        date: workoutDate,
        feeling: workout.feeling ?? null,
        pain: workout.pain ?? null,
        rpe: workout.rpe ?? null,
        ended_at: workout.endedAt ?? null,
        duration_ms: workout.durationMs ?? null,
        is_template: isTemplate,
        created_at: workoutCreatedAt,
        updated_at: workoutUpdatedAt,
      })

      const steps = workout.steps ?? []
      for (const [position, step] of steps.entries()) {
        const stepId = nextStepId
        nextStepId += 1

        const stepCreatedAt = workoutCreatedAt
        const stepUpdatedAt = workoutUpdatedAt

        workoutSteps.push({
          id: stepId,
          workout_id: workoutId,
          step_type: stepTypeMap[step.type ?? ""] ?? "custom",
          position,
          created_at: stepCreatedAt,
          updated_at: stepUpdatedAt,
        })

        for (const exerciseGuid of step.exercises ?? []) {
          const exerciseId = exerciseIdMap.get(exerciseGuid)
          if (exerciseId === undefined) {
            missingExercises.add(exerciseGuid)
            continue
          }

          workoutStepExercises.push({
            id: nextStepExerciseId,
            workout_step_id: stepId,
            exercise_id: exerciseId,
            created_at: stepCreatedAt,
            updated_at: stepUpdatedAt,
          })
          nextStepExerciseId += 1
        }

        for (const setItem of step.sets ?? []) {
          const exerciseGuid = setItem.exercise
          const exerciseId = exerciseIdMap.get(exerciseGuid)
          if (exerciseId === undefined) {
            missingExercises.add(exerciseGuid)
            continue
          }

          const setDate = sanitizeMsDate(
            convertDate(setItem.date) ??
              workoutDate ??
              (typeof setItem.createdAt === "number" ? setItem.createdAt : null) ??
              workoutCreatedAt,
          )
          const createdAt = setItem.createdAt ?? workoutCreatedAt
          const updatedAt = setItem.completedAt ?? createdAt

          sets.push({
            id: nextSetId,
            workout_step_id: stepId,
            exercise_id: exerciseId,
            is_warmup: Boolean(setItem.isWarmup),
            date: setDate,
            is_weak_ass_record: Boolean(setItem.isWeakAssRecord),
            reps: setItem.reps ?? null,
            weight_mcg: setItem.weightMcg ?? null,
            distance_mm: setItem.distanceMm ?? null,
            duration_ms: setItem.durationMs ?? null,
            speed_kph: null,
            rest_ms: setItem.restMs ?? null,
            completed_at: setItem.completedAt ?? null,
            created_at: createdAt,
            updated_at: updatedAt,
          })
          nextSetId += 1
        }
      }
    }
  }

  processWorkoutCollection(legacy.workoutStore.workouts, false)
  processWorkoutCollection(legacy.workoutStore.workoutTemplates, true)

  if (missingExercises.size > 0) {
    const missingList = Array.from(missingExercises).sort().join(", ")
    throw new Error(`Missing exercise references for: ${missingList}`)
  }

  const converted = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    data: {
      settings: [] as unknown[],
      exercises,
      exercise_metrics: exerciseMetrics,
      workouts,
      workout_steps: workoutSteps,
      workout_step_exercises: workoutStepExercises,
      sets,
      tags: [] as unknown[],
      workouts_tags: [] as unknown[],
      workout_steps_tags: [] as unknown[],
      sets_tags: [] as unknown[],
      exercises_tags: [] as unknown[],
    },
  }

  await writeFile(outputPath, JSON.stringify(converted, null, 2))
  console.log(`Converted export written to ${outputPath}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const output = resolveOutputPath(options.input, options.output)
  await convertLegacyExport({ input: options.input, output })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
