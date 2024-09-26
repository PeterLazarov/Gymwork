import { forwardRef, RefObject, useEffect, useRef } from 'react'
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
import { durationTimerKey } from 'app/db/stores/TimerStore'
import { useStores } from 'app/db/helpers/useStores'
import { Duration } from 'luxon'
import { observer } from 'mobx-react-lite'

type Props = {
  value: Duration
  onUpdate: (duration: Duration) => void
  hideHours?: boolean
  hideTimer?: boolean
  onSubmitEditing?: () => void
}

export default observer(
  forwardRef<TextInputRN, Props>(function DurationInput(
    { value, onUpdate, hideHours, onSubmitEditing, hideTimer },
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

    const { timerStore } = useStores()
    // Should durationTimer be additive?
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const durationTimer = timerStore.timers.get(durationTimerKey)!
    useEffect(() => {
      onUpdate(durationTimer.timeElapsed)
    }, [durationTimer.timeElapsed])

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {!hideTimer && (
          <View>
            {durationTimer.isRunning ? (
              <IconButton onPress={durationTimer.stop}>
                <Icon icon="stop" />
              </IconButton>
            ) : (
              <IconButton onPress={durationTimer.resume}>
                <Icon icon="play" />
              </IconButton>
            )}
          </View>
        )}

        {!hideHours && (
          <>
            <NumberInput
              value={hours ?? 0}
              style={{ textAlign: 'center', flexGrow: 1 }}
              inputMode="numeric"
              multiline={false}
              keyboardType="number-pad"
              onChange={hours => {
                const updatedDuration = value.set({ hours })
                onUpdate(updatedDuration)
                durationTimer.setTimeElapsed(updatedDuration)
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
          style={{ textAlign: 'center', flexGrow: 1 }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChange={minutes => {
            if (minutes <= 59) {
              const updatedDuration = value.set({ minutes })
              onUpdate(updatedDuration)
              durationTimer.setTimeElapsed(updatedDuration)
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
          style={{ textAlign: 'center', flexGrow: 1 }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChange={seconds => {
            if (seconds <= 59) {
              const updatedDuration = value.set({ seconds })
              onUpdate(updatedDuration)
              durationTimer.setTimeElapsed(updatedDuration)
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
