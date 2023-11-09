import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import { ButtonContainer, ButtonText } from '../designSystem/Button'
import texts from '../texts'

type Props = {
  isWorkoutStarted: boolean
  createWorkout: () => void
}

const WorkoutControlButtons: React.FC<Props> = ({
  isWorkoutStarted,
  createWorkout,
}) => {
  const router = useRouter()

  function onAddExercisePress() {
    router.push('/ExerciseSelect')
  }

  function copyPrevWorkout() {
    // TODO
  }
  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 8 }}>
      {!isWorkoutStarted && (
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
      {isWorkoutStarted && (
        <ButtonContainer
          variant="primary"
          onPress={onAddExercisePress}
        >
          <ButtonText variant="primary">{texts.addExercise}</ButtonText>
        </ButtonContainer>
      )}
    </View>
  )
}

export default WorkoutControlButtons
