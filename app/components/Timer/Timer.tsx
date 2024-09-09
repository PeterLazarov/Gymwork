import { observer } from 'mobx-react-lite'
import React, { forwardRef, useMemo, useState } from 'react'
import { TextInput, View } from 'react-native'
import { Duration } from 'luxon'

import TimerEditModal from '../TimerEditModal'
import useTimer from 'app/db/stores/useTimer'
import { IconButton, Icon, colors } from 'designSystem'
import NumberInput from '../NumberInput'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const Timer = forwardRef<TextInput>((_, ref) => {
  const restTimer = useTimer()
  const percentTimeLeft = useMemo(() => {
    if (restTimer.duration.toMillis() === 0) {
      return 0
    }

    const percentage =
      Math.min(
        restTimer.timeElapsed.toMillis() / restTimer.duration.toMillis(),
        1
      ) * 100

    return percentage
  }, [restTimer.duration, restTimer.inCountdownMode, restTimer.timeLeft])

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

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
          paddingHorizontal: 4,
        }}
      >
        <AnimatedCircularProgress
          size={40}
          width={2}
          fill={percentTimeLeft}
          rotation={0}
          tintColor={colors.primary}
        >
          {_ => (
            <View>
              {restTimer.isRunning ? (
                <IconButton onPress={restTimer.stop}>
                  <Icon icon="stop" />
                </IconButton>
              ) : (
                <IconButton onPress={restTimer.resume}>
                  <Icon icon="play" />
                </IconButton>
              )}
            </View>
          )}
        </AnimatedCircularProgress>

        <NumberInput
          dense
          style={{ flexGrow: 1, textAlign: 'center' }}
          value={Math.round(restTimer.timeElapsed.as('seconds'))}
          onChange={seconds => {
            restTimer.stop()
            restTimer.setTimeElapsed(Duration.fromDurationLike({ seconds }))
          }}
          ref={ref}
        />
        <IconButton
          onPress={onSettingsPress}
          style={{ width: 48, aspectRatio: 1 }}
        >
          <Icon icon="settings-outline" />
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
})

export default observer(Timer)
