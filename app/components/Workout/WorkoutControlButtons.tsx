import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { colors, Icon, Button, ButtonText } from 'designSystem'

type Props = {}

const WorkoutControlButtons: React.FC<Props> = () => {
  const { stateStore, workoutStore } = useStores()

  const isWorkoutStarted = !!stateStore.openedWorkout
  const hasNotes = stateStore.openedWorkout?.notes !== ''

  function onAddExercisePress() {
    navigate('ExerciseSelect')
  }

  function createWorkout() {
    workoutStore.createWorkout()
    navigate('ExerciseSelect')
  }

  function copyPrevWorkout() {
    // TODO
  }

  function onCommentPress() {
    navigate('WorkoutFeedback')
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        justifyContent: 'center',
      }}
    >
      {!isWorkoutStarted && (
        <>
          <Button
            variant="primary"
            onPress={createWorkout}
            style={{ flex: 1 }}
          >
            <Icon
              color={colors.primaryText}
              icon="add"
            />
            <ButtonText variant="primary">{translate('newWorkout')}</ButtonText>
          </Button>
          <Button
            variant="primary"
            onPress={copyPrevWorkout}
            style={{ flex: 1 }}
            disabled
          >
            <Icon
              color={colors.primaryText}
              icon="copy-outline"
            />
            <ButtonText variant="primary">
              {translate('copyWorkout')}
            </ButtonText>
          </Button>
        </>
      )}
      {isWorkoutStarted && (
        <>
          <Button
            variant="primary"
            onPress={onAddExercisePress}
            style={{ flex: 1 }}
          >
            <Icon
              color={colors.primaryText}
              icon="add"
            />
            <ButtonText variant="primary">
              {translate('addExercise')}
            </ButtonText>
          </Button>

          <Button
            variant="primary"
            onPress={onCommentPress}
            style={{ flex: 1 }}
          >
            <Icon
              color={colors.primaryText}
              icon="chatbox-ellipses"
            />
            <ButtonText variant="primary">
              {hasNotes ? 'View comment' : 'Add comment'}
            </ButtonText>
          </Button>
        </>
      )}
    </View>
  )
}

export default observer(WorkoutControlButtons)
