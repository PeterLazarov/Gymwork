import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Icon } from '../../../designSystem'
import colors from '../../../designSystem/colors'
import { translate } from 'app/i18n'
import { AppStackParamList } from 'app/navigators'
import { Divider } from 'designSystem'

type Props = {
  createWorkout: () => void
}

const WorkoutControlButtons: React.FC<Props> = ({ createWorkout }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, 'Workout'>>()
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
        backgroundColor: colors.primary,
      }}
    >
      {!isWorkoutStarted && (
        <>
          <Button
            mode="text"
            onPress={createWorkout}
            style={{ flex: 1 }}
            textColor={colors.primaryText}
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="add"
              />
            )}
          >
            {translate('newWorkout')}
          </Button>
          <Divider
            style={{ backgroundColor: colors.primaryText, flex: 0 }}
            orientation="vertical"
          />
          <Button
            mode="text"
            onPress={copyPrevWorkout}
            style={{ flex: 1 }}
            textColor={colors.primaryText}
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
        <>
          <Button
            mode="text"
            onPress={onAddExercisePress}
            style={{ flex: 1 }}
            textColor={colors.primaryText}
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="add"
              />
            )}
          >
            {translate('addExercise')}
          </Button>

          <Divider
            style={{ backgroundColor: colors.primaryText, flex: 0 }}
            orientation="vertical"
          />
          <Button
            mode="text"
            onPress={onCommentPress}
            style={{ flex: 1 }}
            textColor={colors.primaryText}
            icon={() => (
              <Icon
                color={colors.primaryText}
                icon="chatbox-ellipses"
              />
            )}
          >
            {hasNotes ? 'View comment' : 'Add comment'}
          </Button>
        </>
      )}
    </View>
  )
}

export default observer(WorkoutControlButtons)
