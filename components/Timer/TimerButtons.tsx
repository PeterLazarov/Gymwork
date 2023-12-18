import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Icon } from '../../designSystem'

const TimerButtons: React.FC = () => {
  const { timeStore } = useStores()

  return (
    <>
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
    </>
  )
}

export default observer(TimerButtons)
