import NumberInput from 'app/components/NumberInput'
import manageInputFocus from 'app/utils/inputFocus'
import { fontSize } from 'designSystem'
import { forwardRef, useRef } from 'react'
import { View, Text, TextInput as TextInputRN } from 'react-native'

type Props = {
  valueSeconds: number
  onUpdate: (seconds: number) => void
  hideHours?: boolean
  onSubmitEditing?: () => void
}

const DurationInput = forwardRef<TextInputRN, Props>(
  ({ valueSeconds, onUpdate, hideHours, onSubmitEditing }, ref) => {
    function onChange(hours: number, minutes: number, seconds: number) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      onUpdate(totalSeconds)
    }

    const hours = Math.floor(valueSeconds / 3600)
    const minutes = Math.floor((valueSeconds % 3600) / 60)
    const seconds = valueSeconds % 60

    const input1 = ref ?? useRef<TextInputRN>(null)
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
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {!hideHours && (
          <>
            <NumberInput
              value={hours}
              style={{ textAlign: 'center' }}
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
            />
            <Text style={{ fontSize: fontSize.xs }}>:</Text>
          </>
        )}
        <NumberInput
          value={minutes}
          style={{ textAlign: 'center' }}
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
        />
        <Text style={{ fontSize: fontSize.xs }}>:</Text>
        <NumberInput
          value={seconds}
          style={{ textAlign: 'center' }}
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
        />
      </View>
    )
  }
)

export default DurationInput
