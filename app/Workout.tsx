import { onPatch } from 'mobx-state-tree'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import DayControl from '../components/DayControl'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseListItem from '../components/WorkoutExerciseListItem'
import { Exercise } from '../models/Exercise'
import { Workout } from '../models/Workout'
import { useStores } from '../models/helpers/useStores'

export default function WorkoutPage() {
  const { workoutStore } = useStores()
  const [workout, setWorkout] = useState<Workout>()

  onPatch(workoutStore, patch => {
    if (
      patch.path === '/currentWorkoutDate' ||
      patch.path.includes('/exercises')
    ) {
      // TODO: workoutStore.currentWorkout view doesn't work. Why?
      const [updatedWorkout] = workoutStore.workouts.filter(
        w => w.date === workoutStore.currentWorkoutDate
      )
      setWorkout(updatedWorkout)
    }
  })

  function newWorkout() {
    const workout = workoutStore.createWorkout()
    setWorkout(workout)
  }

  async function addExercise(exercise: Exercise) {
    const updatedWorkout = workoutStore.addWorkoutExercise(exercise)

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
