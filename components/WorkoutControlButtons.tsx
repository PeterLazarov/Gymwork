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

  function onBack() {
    setShowExercisePicker(false)
  }
  function copyPrevWorkout() {
    // TODO
  }
  return (
    <>
      {showExercisePicker && (
        <ExercisePicker
          onChange={handleAddExercise}
          onBack={onBack}
        />
      )}

      <View
        style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 8 }}
      >
        {!workout && (
          <>
            <ButtonContainer
              primary
              onPress={createWorkout}
            >
              <ButtonText primary>{texts.newWorkout}</ButtonText>
            </ButtonContainer>
            <ButtonContainer
              primary
              onPress={copyPrevWorkout}
            >
              <ButtonText primary>{texts.copyPreviousWorkout}</ButtonText>
            </ButtonContainer>
          </>
        )}
        {workout && (
          <ButtonContainer
            primary
            onPress={openExercisePicker}
          >
            <ButtonText primary>{texts.addExercise}</ButtonText>
          </ButtonContainer>
        )}
      </View>
    </>
  )
}

export default WorkoutControlButtons
