import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'

import DayControl from '../components/DayControl'
import Nav from '../components/Nav'
import ExercisePicker, { Exercise } from '../components/ExercisePicker'
import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'

const Workout = () => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showExercisePicker, setShowExercisePicker] = useState(false)

  function addExercise() {
    setShowExercisePicker(true)
  }
  function handlePickExercise(exercise: Exercise) {
    setExercises(exercises.concat(exercise))
    setShowExercisePicker(false)
  }

  return (
    <View>
      <Nav />
      <Text style={{ textAlign: 'center' }}>Workout</Text>
      <DayControl />
      {showExercisePicker && <ExercisePicker onChange={handlePickExercise} />}

      {exercises.map(exercise => (
        <WorkoutExerciseEntry exercise={exercise}></WorkoutExerciseEntry>
      ))}

      <Button
        title="Add exercise"
        onPress={addExercise}
      ></Button>
    </View>
  )
}

export default Workout
