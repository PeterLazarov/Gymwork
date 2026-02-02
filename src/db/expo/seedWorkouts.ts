import convert from "convert-units"
import { DateTime } from "luxon"

import { withOperation } from "../../utils/observability"
import { schema } from "../schema"
import type { DrizzleDBType } from "../useDB"

import type { ExerciseSeedList } from "./expoSeeder"

const { workouts, workout_steps, workout_step_exercises, sets } = schema

const numberOfWorkouts = 20
const weightIncrementKg = 2.5
const setDuration = 100 * 1000
const rest = 300 * 1000

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function seedWorkouts(drizzleDB: DrizzleDBType, exerciseList: ExerciseSeedList) {
  return withOperation("db.seedWorkouts", async () => {
    if (exerciseList.length === 0) {
      console.log("No exercises available, skipping workout seeding")
      return
    }

    const today = DateTime.fromISO(DateTime.now().toISODate()!)

    const benchPressExercise = exerciseList.find((e) => e.exercise.name?.toLowerCase().includes("bench press"))
    const squatExercise = exerciseList.find((e) => e.exercise.name?.toLowerCase().includes("squat"))
    const cardioExercise = exerciseList.find((e) => e.exercise.muscle_areas?.includes("Cardio"))

    let daysAgo = 0

    for (let i = 0; i < numberOfWorkouts; i++) {
      if (i > 0) {
        daysAgo += between(1, 3)
      }

      const workoutDate = today.minus({ days: daysAgo }).set({ hour: 0, minute: 0, second: 0 })
      const workoutDateMs = workoutDate.toMillis()

      let workoutTime = workoutDate.set({ hour: 8, minute: 0, second: 0 })

      const insertWorkoutQuery = await drizzleDB
        .insert(workouts)
        .values({
          date: workoutDateMs,
          notes: Array.from({ length: between(0, 20) })
            .map(() => "word")
            .join(" ")
            .trim(),
          rpe: between(0, 1) ? between(5, 10) : null,
          pain: (["pain", "discomfort", "noPain", null] as const)[between(0, 3)],
          is_template: false,
        })
        .execute()
        .catch((err) => {
          console.error("insert workouts", err)
          throw err
        })
      const workoutId = insertWorkoutQuery.lastInsertRowId

      const numSteps = between(3, 8)

      for (let stepIndex = 0; stepIndex < numSteps; stepIndex++) {
        const stepTypeRoll = Math.random()
        let stepExercises: ExerciseSeedList
        let isSuperSet = false

        if (stepTypeRoll < 0.1 && benchPressExercise && squatExercise) {
          stepExercises = [benchPressExercise, squatExercise]
          isSuperSet = true
        } else if (stepTypeRoll < 0.2 && benchPressExercise) {
          stepExercises = [benchPressExercise]
        } else if (stepTypeRoll < 0.3 && cardioExercise) {
          stepExercises = [cardioExercise]
        } else {
          const randomExercise = exerciseList[between(0, exerciseList.length - 1)]
          stepExercises = [randomExercise]
        }

        const workoutStepResult = await drizzleDB
          .insert(workout_steps)
          .values({
            step_type: isSuperSet ? "superset" : "plain",
            workout_id: workoutId,
            position: stepIndex,
          })
          .catch((err) => {
            console.log({ err, stepIndex, workoutId })
            throw err
          })
        const workoutStepId = workoutStepResult!.lastInsertRowId

        for (const exercise of stepExercises) {
          const exerciseId = exerciseList.indexOf(exercise) + 1
          await drizzleDB
            .insert(workout_step_exercises)
            .values({
              workout_step_id: workoutStepId,
              exercise_id: exerciseId,
            })
            .execute()
            .catch((err) => {
              console.error("insert workout_step_exercises", err)
              throw err
            })
        }

        const isCardio = stepExercises[0] === cardioExercise
        const numSets = isSuperSet ? between(2, 3) * 2 : between(2, 5)

        const groupSets: (typeof sets.$inferInsert)[] = []

        let setCreatedAt = workoutTime.toMillis()

        for (let setIndex = 0; setIndex < numSets; setIndex++) {
          const exercise = isSuperSet ? stepExercises[setIndex % 2] : stepExercises[0]
          const exerciseId = exerciseList.indexOf(exercise) + 1

          const restMs = setIndex > 0 ? rest : 0
          workoutTime = workoutTime.plus({
            milliseconds: restMs + setDuration,
          })

          if (setIndex > 0) {
            setCreatedAt += 60 * 1000
          }

          if (isCardio) {
            const km = between(1, 3)
            const duration = km * between(4, 7)
            groupSets.push({
              workout_step_id: workoutStepId,
              exercise_id: exerciseId,
              reps: null,
              weight_mcg: null,
              duration_ms: convert(duration).from("min").to("ms"),
              distance_mm: convert(km).from("km").to("mm"),
              rest_ms: restMs,
              is_warmup: false,
              date: workoutDateMs,
              is_weak_ass_record: false,
              completed_at: setCreatedAt,
              created_at: setCreatedAt,
            })
          } else {
            const hasWeight = exercise.measurements.weight
            groupSets.push({
              workout_step_id: workoutStepId,
              exercise_id: exerciseId,
              reps: between(3, 12),
              weight_mcg: hasWeight
                ? convert(between(8, 40) * weightIncrementKg)
                    .from("kg")
                    .to("mcg")
                : null,
              duration_ms: null,
              distance_mm: null,
              rest_ms: restMs,
              is_warmup: setIndex === 0 || (isSuperSet && setIndex === 1),
              date: workoutDateMs,
              is_weak_ass_record: false,
              completed_at: setCreatedAt,
              created_at: setCreatedAt,
            })
          }
        }

        await drizzleDB.insert(sets).values(groupSets)
      }
    }

    console.log("added workouts")
  })
}
