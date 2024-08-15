import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import WorkoutHeaderTimerButtons from '../Timer/TimerButtons'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'
import { Icon, colors } from 'designSystem'

const WorkoutHeader: React.FC = () => {
  const { stateStore } = useStores()

  function openCalendar() {
    navigate('Calendar')
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
        titleStyle={{ color: colors.secondaryText }}
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
