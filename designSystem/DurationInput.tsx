import { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import { View, TextInput as TextInputRN } from 'react-native'

import {
  Text,
  NumberInput,
  fontSize,
  manageInputFocus,
  Icon,
  IconButton,
} from 'designSystem'
import { translate } from 'app/i18n'
import { Duration } from 'luxon'
import { observer } from 'mobx-react-lite'
import { Timer } from 'app/db/models/Timer'

type Props = {
  value: Duration
  onUpdate: (duration: Duration) => void
  hideHours?: boolean
  onSubmitEditing?: () => void
  timer?: Timer
}

export default observer(
  forwardRef<TextInputRN, Props>(function DurationInput(
    { value, onUpdate, hideHours, onSubmitEditing, timer },
    ref
  ) {
    const { hours, minutes, seconds } = value.shiftToAll().toObject()

    const _input1 = useRef<TextInputRN>(null)
    const input1 = (ref ?? _input1) as RefObject<TextInputRN>
    const input2 = useRef<TextInputRN>(null)
    const input3 = useRef<TextInputRN>(null)
    const inputRefs = [input1, input2, input3]

    const { onHandleSubmit } = manageInputFocus(inputRefs, () =>
      onSubmitEditing?.()
    )

    useEffect(() => {
      if (timer?.timeElapsed && timer?.type === 'duration') {
        onUpdate(timer?.timeElapsed)
      }
    }, [timer?.timeElapsed, timer?.type])

    const hideTimer = useMemo(() => {
      return !timer
    }, [timer])

    function onResume() {
      if (!timer) return

      if (timer.type !== 'duration') {
        timer?.setTimeElapsed(value)
        timer.setProp('type', 'duration')
      }

      timer.resume()
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {!hideTimer && (
          <View style={{ paddingLeft: 4 }}>
            {timer?.type === 'duration' && timer?.isRunning ? (
              <IconButton onPress={timer?.stop}>
                <Icon icon="stop" />
              </IconButton>
            ) : (
              <IconButton onPress={onResume}>
                <Icon icon="play" />
              </IconButton>
            )}
          </View>
        )}

        {!hideHours && (
          <>
            <NumberInput
              value={hours ?? 0}
              style={{ textAlign: 'center', flex: 1 }}
              inputMode="numeric"
              multiline={false}
              keyboardType="number-pad"
              onChange={hours => {
                const updatedDuration = value.shiftToAll().set({ hours })
                onUpdate(updatedDuration)
                if (timer?.type === 'duration') {
                  timer?.setTimeElapsed(updatedDuration)
                  timer?.stop()
                }
              }}
              placeholder={translate('hours')}
              maxLength={2}
              ref={input1}
              returnKeyType="next"
              onSubmitEditing={() => onHandleSubmit(input1)}
              maxDecimals={0}
              label={translate('hours')}
            />
            <Text style={{ fontSize: fontSize.xs }}>:</Text>
          </>
        )}
        <NumberInput
          value={minutes ?? 0}
          style={{ textAlign: 'center', flex: 1 }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChange={minutes => {
            if (minutes <= 59) {
              const updatedDuration = value.shiftToAll().set({ minutes })
              timer?.stop()
              onUpdate(updatedDuration)
              if (timer?.type === 'duration') {
                timer?.setTimeElapsed(updatedDuration)
                timer?.stop()
              }
            }
          }}
          placeholder={translate('minutes')}
          maxLength={2}
          ref={input2}
          returnKeyType="next"
          onSubmitEditing={() => onHandleSubmit(input2)}
          maxDecimals={0}
          label={translate('minutes')}
        />
        <Text style={{ fontSize: fontSize.xs }}>:</Text>
        <NumberInput
          value={seconds ?? 0}
          style={{ textAlign: 'center', flex: 1 }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChange={seconds => {
            if (seconds <= 59) {
              const updatedDuration = value.shiftToAll().set({ seconds })
              onUpdate(updatedDuration)
              if (timer?.type === 'duration') {
                timer?.setTimeElapsed(updatedDuration)
                timer?.stop()
              }
            }
          }}
          placeholder={translate('seconds')}
          maxLength={2}
          ref={input3}
          onSubmitEditing={() => onHandleSubmit(input3)}
          maxDecimals={0}
          label={translate('seconds')}
        />
      </View>
    )
  })
)
