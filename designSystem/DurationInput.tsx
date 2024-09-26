import { forwardRef, RefObject, useRef } from 'react'
import { View, TextInput as TextInputRN } from 'react-native'

import { Text, NumberInput, fontSize, manageInputFocus } from 'designSystem'
import { translate } from 'app/i18n'

type Props = {
  valueSeconds: number
  onUpdate: (seconds: number) => void
  hideHours?: boolean
  onSubmitEditing?: () => void
}

export default forwardRef<TextInputRN, Props>(function DurationInput(
  { valueSeconds, onUpdate, hideHours, onSubmitEditing },
  ref
) {
  function onChange(hours: number, minutes: number, seconds: number) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    onUpdate(totalSeconds)
  }

  const hours = Math.floor(valueSeconds / 3600)
  const minutes = Math.floor((valueSeconds % 3600) / 60)
  const seconds = valueSeconds % 60

  const _input1 = useRef<TextInputRN>(null)
  const input1 = (ref ?? _input1) as RefObject<TextInputRN>
  const input2 = useRef<TextInputRN>(null)
  const input3 = useRef<TextInputRN>(null)
  const inputRefs = [input1, input2, input3]

  const { onHandleSubmit } = manageInputFocus(inputRefs, () =>
    onSubmitEditing?.()
  )

  return (
    <View
      style={{
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {!hideHours && (
        <>
          <NumberInput
            value={hours}
            style={{ textAlign: 'center', flexGrow: 1 }}
            inputMode="numeric"
            multiline={false}
            keyboardType="number-pad"
            onChange={hours => {
              onChange(hours, minutes, seconds)
            }}
            placeholder="hh"
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
        value={minutes}
        style={{ textAlign: 'center', flexGrow: 1 }}
        inputMode="numeric"
        multiline={false}
        keyboardType="number-pad"
        onChange={newMinutes => {
          if (newMinutes <= 59) {
            onChange(hours, newMinutes, seconds)
          }
        }}
        placeholder="mm"
        maxLength={2}
        ref={input2}
        returnKeyType="next"
        onSubmitEditing={() => onHandleSubmit(input2)}
        maxDecimals={0}
        label={translate('minutes')}
      />
      <Text style={{ fontSize: fontSize.xs }}>:</Text>
      <NumberInput
        value={seconds}
        style={{ textAlign: 'center', flexGrow: 1 }}
        inputMode="numeric"
        multiline={false}
        keyboardType="number-pad"
        onChange={newSecs => {
          if (newSecs <= 59) {
            onChange(hours, minutes, newSecs)
          }
        }}
        placeholder="ss"
        maxLength={2}
        ref={input3}
        onSubmitEditing={() => onHandleSubmit(input3)}
        maxDecimals={0}
        label={translate('seconds')}
      />
    </View>
  )
})
