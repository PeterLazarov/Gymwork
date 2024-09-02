import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { colors, Icon, Button, ButtonText } from 'designSystem'

const WorkoutControlButtons: React.FC = () => {
  const { stateStore, workoutStore } = useStores()

  const isWorkoutStarted = !!stateStore.openedWorkout
  const hasNotes = stateStore.openedWorkout?.notes !== ''

  function onAddExercisePress() {
    if (!isWorkoutStarted) {
      workoutStore.createWorkout()
    }
    navigate('ExerciseSelect')
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
      <Button
        variant="primary"
        onPress={onAddExercisePress}
        style={{ flex: 1 }}
      >
        <Icon
          color={colors.primaryText}
          icon="add"
        />
        <ButtonText variant="primary">{translate('addExercise')}</ButtonText>
      </Button>
      {isWorkoutStarted && (
        <Button
          variant="secondary"
          onPress={onCommentPress}
          style={{ flex: 1 }}
        >
          <Icon
            color={colors.primaryText}
            icon={hasNotes ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
          />
          <ButtonText variant="secondary">
            {translate(hasNotes ? 'viewComment' : 'addComment')}
          </ButtonText>
        </Button>
      )}
    </View>
  )
}

export default observer(WorkoutControlButtons)
