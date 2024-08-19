import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { Icon, IconButton, colors } from 'designSystem'

const TimerButtons: React.FC = () => {
  const { timeStore } = useStores()

  return (
    <>
      {!timeStore.stopwatchRunning && !timeStore.stopwatchPaused && (
        <IconButton
          onPress={timeStore.startStopwatch}
          underlay="darker"
        >
          <Icon
            icon="stopwatch"
            color={colors.primaryText}
          />
        </IconButton>
      )}
      {timeStore.stopwatchPaused && (
        <IconButton
          onPress={timeStore.startStopwatch}
          underlay="darker"
        >
          <Icon
            icon="play"
            color={colors.primaryText}
          />
        </IconButton>
      )}
      {timeStore.stopwatchRunning && (
        <IconButton
          onPress={timeStore.pauseStopwatch}
          underlay="darker"
        >
          <Icon
            icon="pause-outline"
            color={colors.primaryText}
          />
        </IconButton>
      )}
      {(timeStore.stopwatchRunning || timeStore.stopwatchPaused) && (
        <IconButton
          onPress={timeStore.stopStopwatch}
          underlay="darker"
        >
          <Icon
            icon="stop"
            color={colors.primaryText}
          />
        </IconButton>
      )}
    </>
  )
}

export default observer(TimerButtons)
