import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Icon } from '../../designSystem'
import colors from '../../designSystem/colors'

const WorkoutHeader: React.FC = () => {
  const { timeStore } = useStores()
  const router = useRouter()

  function openCalendar() {
    router.push('/Calendar')
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

      <Appbar.Action
        icon={() => <Icon icon="md-calendar-sharp" />}
        onPress={openCalendar}
        animated={false}
      />
      {!timeStore.stopwatchRunning && !timeStore.stopwatchPaused && (
        <Appbar.Action
          icon={() => <Icon icon="stopwatch" />}
          onPress={timeStore.startStopwatch}
          animated={false}
        />
      )}
      {timeStore.stopwatchPaused && (
        <Appbar.Action
          icon={() => <Icon icon="play" />}
          onPress={timeStore.startStopwatch}
          animated={false}
        />
      )}
      {timeStore.stopwatchRunning && (
        <Appbar.Action
          icon={() => <Icon icon="pause-outline" />}
          onPress={timeStore.pauseStopwatch}
          animated={false}
        />
      )}
      {(timeStore.stopwatchRunning || timeStore.stopwatchPaused) && (
        <Appbar.Action
          icon={() => <Icon icon="stop" />}
          onPress={timeStore.stopStopwatch}
          animated={false}
        />
      )}
      <Appbar.Action
        icon={() => <Icon icon="ellipsis-vertical" />}
        onPress={() => {}}
        animated={false}
      />
    </Appbar.Header>
  )
}
export default observer(WorkoutHeader)
