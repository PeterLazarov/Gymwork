import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'

import { dateAtom } from '../atoms'
import DayControl from '../components/DayControl'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseListItem from '../components/WorkoutExerciseListItem'
import { Exercise } from '../models/Exercise'
import { Workout } from '../models/Workout'
import { useStores } from '../models/helpers/useStores'

export default function WorkoutPage() {
  const [globalDate] = useAtom(dateAtom)

  const globalDateISO = useMemo(() => globalDate.toISODate()!, [globalDate])

  const { workoutStore } = useStores()
  const [workout, setWorkout] = useState<Workout>()

  useEffect(() => {
    const [workout] = workoutStore.workouts.filter(
      w => w.date === globalDateISO
    )
    setWorkout(workout)
  }, [globalDateISO, workoutStore])

  function newWorkout() {
    const workout = workoutStore.createWorkout(globalDateISO)
    setWorkout(workout)
  }

  async function addExercise(exercise: Exercise) {
    const updatedWorkout = workoutStore.addWorkoutExercise(
      globalDateISO,
      exercise
    )

    // TODO: newly added exercise not displayed after setWorkout
    setWorkout(updatedWorkout)
  }

  return (
    <View>
      <DayControl />

      <ScrollView>
        {workout?.exercises.map((exercise, i) => (
          <WorkoutExerciseListItem
            key={`${workout.date}_${i}`}
            exercise={exercise}
          />
        ))}
      </ScrollView>

      <WorkoutControlButtons
        isWorkoutStarted={!!workout}
        createWorkout={newWorkout}
        addExercise={addExercise}
      />
    </View>
  )
}
