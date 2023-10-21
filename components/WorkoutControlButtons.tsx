import React, { useState } from 'react'
import { View } from 'react-native'

import ExercisePicker from './ExercisePicker'
import { Workout, Exercise } from '../db/models'
import { ButtonContainer, ButtonText } from '../designSystem/Button'
import texts from '../texts'

type Props = {
  workout?: Workout
  createWorkout: () => void
  addExercise: (exercise: Exercise) => void
}

const WorkoutControlButtons: React.FC<Props> = ({
  workout,
  createWorkout,
  addExercise,
}) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false)

  function openExercisePicker() {
    setShowExercisePicker(true)
  }

  function handleAddExercise(exercise: Exercise) {
    addExercise(exercise)
    setShowExercisePicker(false)
  }

  function copyPrevWorkout() {
    // TODO
  }
  return (
    <>
      {showExercisePicker && <ExercisePicker onChange={handleAddExercise} />}

      <View
        style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 8 }}
      >
        {!workout && (
          <>
            <ButtonContainer onPress={createWorkout}>
              <ButtonText>{texts.newWorkout}</ButtonText>
            </ButtonContainer>
            <ButtonContainer onPress={copyPrevWorkout}>
              <ButtonText>{texts.copyPreviousWorkout}</ButtonText>
            </ButtonContainer>
          </>
        )}
        {workout && (
          <ButtonContainer onPress={openExercisePicker}>
            <ButtonText>{texts.addExercise}</ButtonText>
          </ButtonContainer>
        )}
      </View>
    </>
  )
}

export default WorkoutControlButtons
