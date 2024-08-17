import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { Icon, colors } from 'designSystem'

const TimerButtons: React.FC = () => {
  const { timeStore } = useStores()

  return (
    <>
      {!timeStore.stopwatchRunning && !timeStore.stopwatchPaused && (
        <Appbar.Action
          icon={() => (
            <Icon
              icon="stopwatch"
              color={colors.primaryText}
            />
          )}
          onPress={timeStore.startStopwatch}
          animated={false}
        />
      )}
      {timeStore.stopwatchPaused && (
        <Appbar.Action
          icon={() => (
            <Icon
              icon="play"
              color={colors.primaryText}
            />
          )}
          onPress={timeStore.startStopwatch}
          animated={false}
        />
      )}
      {timeStore.stopwatchRunning && (
        <Appbar.Action
          icon={() => (
            <Icon
              icon="pause-outline"
              color={colors.primaryText}
            />
          )}
          onPress={timeStore.pauseStopwatch}
          animated={false}
        />
      )}
      {(timeStore.stopwatchRunning || timeStore.stopwatchPaused) && (
        <Appbar.Action
          icon={() => (
            <Icon
              icon="stop"
              color={colors.primaryText}
            />
          )}
          onPress={timeStore.stopStopwatch}
          animated={false}
        />
      )}
    </>
  )
}

export default observer(TimerButtons)
