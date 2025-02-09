import { Duration } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import { TextInput, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

import { useAppTheme } from '@/utils/useAppTheme'
import { Timer } from 'app/db/models/Timer'
import { Icon, IconButton, NumberInput } from 'designSystem'

import TimerEditSheet from './TimerEditSheet'

export type RestInputProps = {
  timer?: Timer
  value?: Duration
  onChange(duration: Duration): void
  onSubmit?: () => void
}

const RestInput = forwardRef<TextInput, RestInputProps>(function RestInput(
  { timer, value, onChange, onSubmit },
  ref
) {
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  const percentTimeLeft = useMemo(() => {
    if (!timer) return 0

    if (timer.duration.toMillis() === 0) {
      return 0
    }

    const percentage =
      Math.min(timer.timeElapsed.toMillis() / timer.duration.toMillis(), 1) *
      100

    return percentage
  }, [timer?.duration, timer?.timeElapsed])

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  function onSettingsPress() {
    setSettingDialogOpen(true)
  }

  function onResume() {
    if (!timer) return

    if (timer.type !== 'rest') {
      timer?.setTimeElapsed(value ?? Duration.fromMillis(0))
      timer.setProp('type', 'rest')
    }
    timer.resume()
  }

  // Recompute the timer state to force a rerender
  useMemo(() => timer?.isRunning, [timer?.isRunning])

  useEffect(() => {
    if (timer?.type === 'rest') {
      onChange(timer.timeElapsed)
    }
  }, [timer?.timeElapsed, timer?.type])

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.xxs,
        }}
      >
        {timer && (
          <AnimatedCircularProgress
            size={40}
            width={2}
            fill={percentTimeLeft}
            rotation={0}
            tintColor={colors.primary}
          >
            {_ => (
              <View>
                {timer.type === 'rest' && timer.isRunning ? (
                  <IconButton onPress={timer.stop}>
                    <Icon icon="stop" />
                  </IconButton>
                ) : (
                  <IconButton onPress={onResume}>
                    <Icon icon="play" />
                  </IconButton>
                )}
              </View>
            )}
          </AnimatedCircularProgress>
        )}

        <NumberInput
          dense
          style={{ flexGrow: 1, textAlign: 'center' }}
          value={value ? Math.round(value.as('seconds') ?? 0) : undefined}
          onChange={seconds => {
            const duration = Duration.fromDurationLike({ seconds })
            if (timer?.type === 'rest') {
              timer?.stop()
              timer?.setTimeElapsed(duration)
            }
            onChange(duration)
          }}
          ref={ref}
          onSubmitEditing={onSubmit}
        />

        {timer && (
          <IconButton
            onPress={onSettingsPress}
            style={{ width: 48, aspectRatio: 1 }}
          >
            <Icon icon="settings-outline" />
          </IconButton>
        )}
      </View>
      {timer && (
        <TimerEditSheet
          open={settingDialogOpen}
          onClose={() => {
            setSettingDialogOpen(false)
          }}
          timer={timer}
        />
      )}
    </>
  )
})

export default observer(RestInput)
