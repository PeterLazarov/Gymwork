import { makeExercise, makeSet, makeWorkoutStep, resetFactories } from "@/test/factories"

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
})
