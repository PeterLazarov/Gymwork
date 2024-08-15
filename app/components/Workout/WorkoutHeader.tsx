import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import WorkoutHeaderTimerButtons from '../Timer/TimerButtons'
import { useStores } from '../../db/helpers/useStores'
import { Icon } from '../../../designSystem'
import colors from '../../../designSystem/colors'
import { AppStackParamList } from 'app/navigators'

const WorkoutHeader: React.FC = () => {
  const { stateStore } = useStores()
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, 'Workout'>>()

  function openCalendar() {
    navigation.navigate('Calendar')
  }

  return (
    <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
      <Appbar.Action
        icon={() => <Icon icon="logo-react" />}
        animated={false}
      />
      <Appbar.Content
        title="Gymwork"
        style={{ alignItems: 'flex-start' }}
      />

      {stateStore.isOpenedWorkoutToday && <WorkoutHeaderTimerButtons />}
      <Appbar.Action
        icon={() => <Icon icon="calendar-sharp" />}
        onPress={openCalendar}
        animated={false}
      />
      <Appbar.Action
        icon={() => <Icon icon="ellipsis-vertical" />}
        onPress={() => {}}
        animated={false}
      />
    </Appbar.Header>
  )
}

export default observer(WorkoutHeader)
