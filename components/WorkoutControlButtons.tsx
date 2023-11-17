import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'
import colors from '../designSystem/colors'
import texts from '../texts'

type Props = {
  createWorkout: () => void
}

const WorkoutControlButtons: React.FC<Props> = ({ createWorkout }) => {
  const router = useRouter()
  const { openedWorkout } = useStores()

  const isWorkoutStarted = !!openedWorkout
  const hasNotes = openedWorkout?.notes !== ''
  function onAddExercisePress() {
    router.push('/ExerciseSelect')
  }

  function copyPrevWorkout() {
    // TODO
  }

  function onCommentPress() {
    router.push('/WorkoutFeedback')
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
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="add"
              />
            )}
          >
            {texts.newWorkout}
          </Button>
          <Button
            mode="contained"
            onPress={copyPrevWorkout}
            style={{ flex: 1 }}
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="copy-outline"
              />
            )}
          >
            {texts.copyWorkout}
          </Button>
        </>
      )}
      {isWorkoutStarted && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            mode="contained"
            onPress={onAddExercisePress}
            style={{ flex: 1 }}
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="add"
              />
            )}
          >
            {texts.addExercise}
          </Button>
          <Button
            mode="contained"
            onPress={onCommentPress}
            style={{ flex: 1 }}
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="chatbox-ellipses"
              />
            )}
          >
            {hasNotes ? 'View comment' : 'Add comment'}
          </Button>
        </View>
      )}
    </View>
  )
}

export default observer(WorkoutControlButtons)
