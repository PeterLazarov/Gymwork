import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

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
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!isWorkoutStarted && (
        <>
          <Button
            mode="contained"
            onPress={createWorkout}
            style={{ flex: 1 }}
          >
            {texts.newWorkout}
          </Button>
          <Button
            mode="contained"
            onPress={copyPrevWorkout}
            style={{ flex: 1 }}
          >
            {texts.copyWorkout}
          </Button>
        </>
      )}
      {isWorkoutStarted && (
        <Button
          mode="contained"
          onPress={onAddExercisePress}
          style={{ flex: 1 }}
        >
          {texts.addExercise}
        </Button>
      )}
    </View>
  )
}

export default WorkoutControlButtons
