import type { Exercise, Set, WorkoutStep, WorkoutStepExercise } from "@/db/schema"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"

let _nextId = 1

export function resetFactories() {
  _nextId = 1
}

function nextId() {
  return _nextId++
}

const TIMESTAMP = 1000000000000

export function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: nextId(),
    name: "Exercise",
    images: [],
    equipment: [],
    muscle_areas: [],
    muscles: [],
    instructions: [],
    tips: [],
    position: null,
    stance: null,
    is_favorite: false,
    created_at: TIMESTAMP,
    updated_at: TIMESTAMP,
    ...overrides,
  }
}

export function makeSet(
  overrides: Partial<Set> & { exercise: Exercise },
): Set & { exercise: Exercise } {
  const { exercise, ...rest } = overrides
  return {
    id: nextId(),
    workout_step_id: 1,
    exercise_id: exercise.id,
    is_warmup: false,
    date: TIMESTAMP,
    is_weak_ass_record: false,
    reps: 10,
    weight_mcg: null,
    distance_mm: null,
    duration_ms: null,
    speed_kph: null,
    rest_ms: null,
    completed_at: null,
    created_at: TIMESTAMP,
    updated_at: TIMESTAMP,
    ...rest,
    exercise,
  }
}

export function makeWorkoutStep(overrides: {
  id?: number
  stepType?: WorkoutStep["step_type"]
  exercises: Exercise[]
  sets: (Set & { exercise: Exercise })[]
}): WorkoutStepModel {
  const workoutStepExercises: (WorkoutStepExercise & { exercise: Exercise })[] =
    overrides.exercises.map((exercise) => ({
      id: nextId(),
      workout_step_id: 1,
      exercise_id: exercise.id,
      created_at: TIMESTAMP,
      updated_at: TIMESTAMP,
      exercise,
    }))

  return WorkoutStepModel.from({
    id: overrides.id ?? nextId(),
    workout_id: 1,
    step_type: overrides.stepType ?? "plain",
    position: 0,
    created_at: TIMESTAMP,
    updated_at: TIMESTAMP,
    workoutStepExercises,
    sets: overrides.sets,
  })
}
