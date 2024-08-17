import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Duration } from 'luxon'

import TimerEditModal from '../TimerEditModal'
import { useStores } from 'app/db/helpers/useStores'
import useTimer from 'app/db/stores/useTimer'
import { Icon, colors, fontSize } from 'designSystem'

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
        }}
      >
        <IconButton
          onPress={restTimer.stop}
          icon={() => <Icon icon="pause-circle" />}
        />
        <IconButton
          onPress={onPlayPress}
          icon={() => <Icon icon="weight-lifter" />}
        />
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
        <IconButton
          onPress={onSettingsPress}
          icon={() => <Icon icon="settings-outline" />}
        />
        <IconButton
          onPress={restTimer.clear}
          icon={() => <Icon icon="timer-off" />}
        />
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
