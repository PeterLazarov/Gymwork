import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Duration } from 'luxon'

import TimerEditModal from '../TimerEditModal'
import { useStores } from 'app/db/helpers/useStores'
import useTimer from 'app/db/stores/useTimer'
import { IconButton, Icon, colors, fontSize } from 'designSystem'

const Timer: React.FC = () => {
  const { timeStore, stateStore } = useStores()
  const restTimer = useTimer()

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  function onPlayPress() {
    // if (!timeStore.timerRunning) {
    restTimer.start(
      Duration.fromObject({ seconds: stateStore.timerDurationSecs })
    )
    // }
  }

  function onSettingsPress() {
    setSettingDialogOpen(true)
  }

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <IconButton onPress={onPlayPress}>
          <Icon icon="weight-lifter" />
        </IconButton>
        <IconButton onPress={restTimer.stop}>
          <Icon icon="pause-circle" />
        </IconButton>
        <View style={styles.timerPanel}>
          <Text style={{ fontSize: fontSize.xs }}>
            <Text style={{ fontWeight: 'bold' }}>W</Text>:{' '}
            {timeStore.stopwatchValue}
          </Text>
          <Text style={{ fontSize: fontSize.xs }}>
            <Text style={{ fontWeight: 'bold', marginRight: 2 }}>R</Text>:{' '}
            {restTimer.timeLeft.toFormat('mm:ss')}
          </Text>
        </View>
        <IconButton onPress={onSettingsPress}>
          <Icon icon="settings-outline" />
        </IconButton>

        <IconButton onPress={restTimer.clear}>
          <Icon icon="timer-off" />
        </IconButton>
      </View>
      <TimerEditModal
        open={settingDialogOpen}
        onClose={() => {
          setSettingDialogOpen(false)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  timerPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLighter,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
    width: 140,
    alignSelf: 'center',
  },
})

export default observer(Timer)
