import { exercises } from '../data/exercises.json'

import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

export type Exercise = (typeof exercises)[number]

const ExercisePicker = (props: {
  onChange: (exercise: Exercise) => unknown
}) => {
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise | undefined
  >(undefined)

  return (
    <Picker
      selectedValue={selectedExercise}
      onValueChange={(itemValue, itemIndex) => {
        setSelectedExercise(itemValue)
        props.onChange(itemValue)
      }}
    >
      {exercises.map(exercise => (
        <Picker.Item
          key={exercise.name}
          label={exercise.name}
          value={exercise}
        />
      ))}
    </Picker>
  )
}

export default ExercisePicker
