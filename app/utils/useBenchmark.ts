import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSetModel } from 'app/db/models'
import { navigate } from 'app/navigators'

let execution = 1
const delay = (wait: number) =>
  new Promise(res => {
    setTimeout(() => {
      res(null)
    }, wait)
  })

const delaysInFunction = 2000

export default function useBenchmark() {
  const { stateStore, workoutStore } = useStores()

  async function performBenchmark() {
    const startingTime = Date.now()

    // go to today
    stateStore.setOpenedDate(new Date().toISOString())
    navigate('Workout')

    await delay(1000)

    //   if no workout, create workout
    if (!stateStore.openedWorkout) {
      workoutStore.createWorkout()
    }

    // open bench press
    stateStore.setProp('openedExerciseGuid', '44')
    navigate('WorkoutExercise')

    await delay(1000)

    //   add record set
    const set = WorkoutSetModel.create({
      exercise: '44',
    })
    set.setWeight(100 + execution, 'kg')
    set.setProp('reps', 12)
    workoutStore.addSet(set)

    navigate('Workout')

    const finishTime = Date.now()

    console.log({ execution })
    console.log(
      `Time to add record: ${(
        (finishTime - delaysInFunction - startingTime) /
        1000
      ).toFixed(2)}s`
    )
    execution++
  }

  return { performBenchmark }
}
