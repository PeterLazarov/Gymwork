import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { DateTime, Duration } from 'luxon'

import { useStores } from 'app/db/helpers/useStores'
import { Icon, useColors, fontSize, Text } from 'designSystem'
import TimerEditModal from './TimerEditModal'
import { translate } from 'app/i18n'
import WorkoutTimerModal from './Timer/WorkoutTimerModal'

const TimerRevived: React.FC = () => {
  const {
    stateStore,
    timerStore: { workoutTimer },
  } = useStores()
  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  const colors = useColors()

  if (
    !stateStore.openedWorkout ||
    stateStore.openedDate !== DateTime.now().toISODate()
  ) {
    return null
  }

  function onPlay() {
    if (stateStore.openedWorkout) {
      workoutTimer.resume()
      stateStore.openedWorkout.setProp('endedAt', undefined)
    }
  }

  function onStop() {
    if (stateStore.openedWorkout) {
      workoutTimer.stop()
      stateStore.openedWorkout.setProp('endedAt', new Date())
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
        {workoutTimer.isRunning ? (
          <IconButton
            onPress={onStop}
            icon={() => <Icon icon="stop-outline" />}
          />
        ) : (
          <IconButton
            onPress={onPlay}
            icon={() => <Icon icon="play-outline" />}
          />
        )}

        <View style={styles(colors.primary).timerPanel}>
          <Text
            style={{
              fontSize: fontSize.xs,
              fontWeight: 'bold',
              color: colors.onPrimary,
            }}
          >
            {translate('workoutDuration')}
          </Text>
          <Text style={{ fontSize: fontSize.xs, color: colors.onPrimary }}>
            {workoutTimer.timeElapsed.toFormat('hh:mm:ss')}
          </Text>
        </View>

        <IconButton
          onPress={onSettingsPress}
          icon={() => <Icon icon="settings-outline" />}
        />
        {/* <IconButton
          onPress={workoutTimer.clear}
          icon={() => <Icon icon="refresh-outline" />}
        /> */}
      </View>
      <WorkoutTimerModal
        open={settingDialogOpen}
        onClose={() => {
          setSettingDialogOpen(false)
        }}
        timer={workoutTimer}
      />
    </>
  )
}

const styles = (backgroundColor: string) =>
  StyleSheet.create({
    timerPanel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginBottom: 4,
      marginTop: -1,
      // width: 140,
      alignSelf: 'center',
    },
  })

export default observer(TimerRevived)
