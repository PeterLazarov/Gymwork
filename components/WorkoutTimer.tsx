import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'

import TimerEditModal from './TimerEditModal'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'
import { BodySmallLabel } from '../designSystem/Label'
import colors from '../designSystem/colors'

const WorkoutTimer: React.FC = () => {
  const { timeStore, stateStore } = useStores()

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  function onPlayPress() {
    if (!timeStore.timerRunning) {
      timeStore.startTimer()
    }
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
          onPress={onPlayPress}
          icon={() => <Icon icon="weight-lifter" />}
        />
        <View style={styles.timerPanel}>
          <BodySmallLabel>W: {timeStore.stopwatchValue}</BodySmallLabel>
          <BodySmallLabel>E: {stateStore.timerValue}</BodySmallLabel>
        </View>
        <IconButton
          onPress={onSettingsPress}
          icon={() => <Icon icon="settings-outline" />}
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
    backgroundColor: colors.lightgray,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
    width: 140,
    alignSelf: 'center',
  },
})

export default observer(WorkoutTimer)
