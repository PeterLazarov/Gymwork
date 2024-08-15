import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Icon } from '../../../designSystem'
import colors from '../../../designSystem/colors'
import { translate } from 'app/i18n'

type Props = {
  createWorkout: () => void
}

const WorkoutControlButtons: React.FC<Props> = ({ createWorkout }) => {
  const navigation = useNavigation()
  const { stateStore } = useStores()

  const isWorkoutStarted = !!stateStore.openedWorkout
  const hasNotes = stateStore.openedWorkout?.notes !== ''

  function onAddExercisePress() {
    navigation.navigate('ExerciseSelect')
  }

  function copyPrevWorkout() {
    // TODO
  }

  function onCommentPress() {
    navigation.navigate('WorkoutFeedback')
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
            {translate('newWorkout')}
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
            {translate('copyWorkout')}
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
            {translate('addExercise')}
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
