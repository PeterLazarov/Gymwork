import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import {
  makeExercise,
  makeExerciseMetric,
  makeSet,
  makeWorkoutStep,
  resetFactories,
} from "@/test/factories"

beforeEach(() => {
  resetFactories()
})

describe("WorkoutStepModel", () => {
  describe("setsNumberMap", () => {
    it("numbers sets sequentially for a plain step", () => {
      const exercise = makeExercise()
      const sets = [
        makeSet({ exercise }),
        makeSet({ exercise }),
        makeSet({ exercise }),
      ]

      const step = makeWorkoutStep({
        stepType: "plain",
        exercises: [exercise],
        sets,
      })

      expect(step.setsNumberMap).toEqual({
        [sets[0].id]: 1,
        [sets[1].id]: 2,
        [sets[2].id]: 3,
      })
    })

    it("numbers superset sets by round, not sequentially", () => {
      const exerciseA = makeExercise({ name: "Exercise A" })
      const exerciseB = makeExercise({ name: "Exercise B" })

      const sets = [
        makeSet({ exercise: exerciseA }),
        makeSet({ exercise: exerciseB }),
        makeSet({ exercise: exerciseA }),
        makeSet({ exercise: exerciseB }),
      ]

      const step = makeWorkoutStep({
        stepType: "superset",
        exercises: [exerciseA, exerciseB],
        sets,
      })

      expect(step.setsNumberMap).toEqual({
        [sets[0].id]: 1,
        [sets[1].id]: 1,
        [sets[2].id]: 2,
        [sets[3].id]: 2,
      })
    })

    it("skips warmup sets in superset numbering", () => {
      const exerciseA = makeExercise({ name: "Exercise A" })
      const exerciseB = makeExercise({ name: "Exercise B" })

      const sets = [
        makeSet({ exercise: exerciseA, is_warmup: true }),
        makeSet({ exercise: exerciseA }),
        makeSet({ exercise: exerciseB }),
        makeSet({ exercise: exerciseA }),
        makeSet({ exercise: exerciseB }),
      ]

      const step = makeWorkoutStep({
        stepType: "superset",
        exercises: [exerciseA, exerciseB],
        sets,
      })

      expect(step.setsNumberMap).toEqual({
        [sets[0].id]: undefined,
        [sets[1].id]: 1,
        [sets[2].id]: 1,
        [sets[3].id]: 2,
        [sets[4].id]: 2,
      })
    })

    it("handles a 3-exercise superset correctly", () => {
      const exerciseA = makeExercise({ name: "Exercise A" })
      const exerciseB = makeExercise({ name: "Exercise B" })
      const exerciseC = makeExercise({ name: "Exercise C" })

      const sets = [
        makeSet({ exercise: exerciseA }),
        makeSet({ exercise: exerciseB }),
        makeSet({ exercise: exerciseC }),
        makeSet({ exercise: exerciseA }),
        makeSet({ exercise: exerciseB }),
        makeSet({ exercise: exerciseC }),
      ]

      const step = makeWorkoutStep({
        stepType: "superset",
        exercises: [exerciseA, exerciseB, exerciseC],
        sets,
      })

      expect(step.setsNumberMap).toEqual({
        [sets[0].id]: 1,
        [sets[1].id]: 1,
        [sets[2].id]: 1,
        [sets[3].id]: 2,
        [sets[4].id]: 2,
        [sets[5].id]: 2,
      })
    })
  })

  describe("target steps", () => {
    function repsExercise() {
      return makeExercise({}, [makeExerciseMetric({ measurement_type: "reps", unit: "reps" })])
    }

    function repsWeightExercise() {
      return makeExercise({}, [
        makeExerciseMetric({ measurement_type: "reps", unit: "reps" }),
        makeExerciseMetric({ measurement_type: "weight", unit: "kg" }),
      ])
    }

    it("flags target steps and leaves plain steps alone", () => {
      const exercise = repsExercise()
      const target = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets: [],
        targetMetric: "reps",
        targetValueBase: 100,
      })
      const plain = makeWorkoutStep({
        stepType: "plain",
        exercises: [exercise],
        sets: [makeSet({ exercise })],
      })

      expect(target.stepType).toBe("target")
      expect(plain.stepType).toBe("plain")
      expect(plain.getTargetDoneBase(false)).toBe(0)
    })

    it("sums reps with remaining derived, warmups included", () => {
      const exercise = repsExercise()
      const sets = [
        makeSet({ exercise, reps: 20, is_warmup: true }),
        makeSet({ exercise, reps: 24 }),
        makeSet({ exercise, reps: 24 }),
      ]
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets,
        targetMetric: "reps",
        targetValueBase: 100,
      })

      expect(step.getTargetDoneBase(false)).toBe(68)
      expect(step.getTargetRemainingBase(false)).toBe(32)
      expect(step.isTargetComplete(false)).toBe(false)
    })

    it("completes on exact hit and stays complete with extra sets", () => {
      const exercise = repsExercise()
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets: [makeSet({ exercise, reps: 60 }), makeSet({ exercise, reps: 40 })],
        targetMetric: "reps",
        targetValueBase: 100,
      })
      expect(step.getTargetRemainingBase(false)).toBe(0)
      expect(step.isTargetComplete(false)).toBe(true)

      const over = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets: [makeSet({ exercise, reps: 60 }), makeSet({ exercise, reps: 48 })],
        targetMetric: "reps",
        targetValueBase: 100,
      })
      expect(over.getTargetRemainingBase(false)).toBe(-8)
      expect(over.isTargetComplete(false)).toBe(true)
    })

    it("is incomplete with no sets", () => {
      const exercise = repsExercise()
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets: [],
        targetMetric: "reps",
        targetValueBase: 100,
      })
      expect(step.isTargetComplete(false)).toBe(false)
    })

    it("counts only completed sets when manual_set_completion is on", () => {
      const exercise = repsExercise()
      const sets = [
        makeSet({ exercise, reps: 50, completed_at: 1000000000001 }),
        makeSet({ exercise, reps: 50, completed_at: null }),
      ]
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets,
        targetMetric: "reps",
        targetValueBase: 100,
      })

      expect(step.getTargetDoneBase(false)).toBe(100)
      expect(step.getTargetDoneBase(true)).toBe(50)
      expect(step.isTargetComplete(false)).toBe(true)
      expect(step.isTargetComplete(true)).toBe(false)
    })

    it("sums tonnage as SUM(weight_mcg * reps)", () => {
      const exercise = repsWeightExercise()
      const sets = [
        makeSet({ exercise, reps: 10, weight_mcg: 1_000_000_000 }),
        makeSet({ exercise, reps: 10, weight_mcg: 1_000_000_000 }),
      ]
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets,
        targetMetric: "tonnage",
        targetValueBase: 100_000_000_000,
      })

      expect(step.getTargetDoneBase(false)).toBe(20_000_000_000)
      expect(step.getTargetRemainingBase(false)).toBe(80_000_000_000)
      expect(step.getTargetTotalDisplay()).toBe(100)
      expect(step.getTargetDoneDisplay(false)).toBe(20)
      expect(step.getTargetLeftDisplay(false)).toBe(80)
      expect(step.getTargetUnit()).toBe("kg")
    })

    it("falls back to SUM(weight_mcg) for weight-only exercises", () => {
      const exercise = makeExercise({}, [
        makeExerciseMetric({ measurement_type: "weight", unit: "kg" }),
      ])
      const sets = [
        makeSet({ exercise, reps: null, weight_mcg: 1_000_000_000 }),
        makeSet({ exercise, reps: null, weight_mcg: 2_000_000_000 }),
      ]
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets,
        targetMetric: "tonnage",
        targetValueBase: 5_000_000_000,
      })

      expect(step.getTargetDoneBase(false)).toBe(3_000_000_000)
    })

    it("sums distance and formats in exercise unit", () => {
      const exercise = makeExercise({}, [
        makeExerciseMetric({ measurement_type: "distance", unit: "km" }),
      ])
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets: [makeSet({ exercise, reps: null, distance_mm: 2_000_000 })],
        targetMetric: "distance",
        targetValueBase: 5_000_000,
      })

      expect(step.getTargetDoneBase(false)).toBe(2_000_000)
      expect(step.getTargetTotalDisplay()).toBe(5)
      expect(step.getTargetDoneDisplay(false)).toBe(2)
      expect(step.getTargetLeftDisplay(false)).toBe(3)
      expect(step.getTargetUnit()).toBe("km")
    })

    it("sums duration and formats with duration_format", () => {
      const exercise = makeExercise({}, [
        makeExerciseMetric({ measurement_type: "duration", unit: "ms", duration_format: "mm:ss" }),
      ])
      const step = makeWorkoutStep({
        stepType: "target",
        exercises: [exercise],
        sets: [makeSet({ exercise, reps: null, duration_ms: 60_000 })],
        targetMetric: "duration",
        targetValueBase: 90_000,
      })

      expect(step.getTargetDoneBase(false)).toBe(60_000)
      expect(step.getTargetTotalDisplay()).toBe("1m30s")
      expect(step.getTargetDoneDisplay(false)).toBe("1m00s")
      expect(step.getTargetLeftDisplay(false)).toBe("0m30s")
    })

    it("computes tonnageMcgReps per set with null safety", () => {
      const exercise = repsWeightExercise()
      expect(SetModel.from(makeSet({ exercise, reps: 4, weight_mcg: 5 })).tonnageMcgReps).toBe(20)
      expect(SetModel.from(makeSet({ exercise, reps: null, weight_mcg: 5 })).tonnageMcgReps).toBe(0)
      expect(SetModel.from(makeSet({ exercise, reps: 4, weight_mcg: null })).tonnageMcgReps).toBe(0)
    })

    it.each([
      [["reps"], ["reps"]],
      [["reps", "weight"], ["reps", "tonnage"]],
      [["weight"], ["tonnage"]],
      [["distance"], ["distance"]],
      [["duration"], ["duration"]],
      [["distance", "duration"], ["distance", "duration"]],
      [["speed", "rest"], []],
    ])("offers %s as %s", (metricTypes, expected) => {
      const exercise = ExerciseModel.from({
        ...makeExercise(),
        exerciseMetrics: metricTypes.map((measurement_type) =>
          makeExerciseMetric({ measurement_type: measurement_type as never, unit: "x" }),
        ),
      })
      expect(exercise.getTargetableMetrics()).toEqual(expected)
    })
  })
})
