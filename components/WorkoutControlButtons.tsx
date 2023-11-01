import React, { useState } from 'react'
import { View } from 'react-native'

import ExercisePicker from './ExercisePicker'
import { Workout, Exercise } from '../dbold/models'
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
              variant="primary"
              onPress={createWorkout}
            >
              <ButtonText variant="primary">{texts.newWorkout}</ButtonText>
            </ButtonContainer>
            <ButtonContainer
              variant="primary"
              onPress={copyPrevWorkout}
            >
              <ButtonText variant="primary">{texts.copyWorkout}</ButtonText>
            </ButtonContainer>
          </>
        )}
        {workout && (
          <ButtonContainer
            variant="primary"
            onPress={openExercisePicker}
          >
            <ButtonText variant="primary">{texts.addExercise}</ButtonText>
          </ButtonContainer>
        )}
      </View>
    </>
  )
}

export default WorkoutControlButtons
