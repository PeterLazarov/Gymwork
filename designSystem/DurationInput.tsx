import manageInputFocus from 'app/utils/inputFocus'
import { fontSize } from 'designSystem'
import { forwardRef, useRef } from 'react'
import { View, Text, TextInput as TextInputRN } from 'react-native'
import { TextInput } from 'react-native-paper'

type Props = {
  valueSeconds: number
  onUpdate: (seconds: number) => void
  hideHours?: boolean
  onSubmitEditing?: () => void
}

const DurationInput = forwardRef<TextInputRN, Props>(
  ({ valueSeconds, onUpdate, hideHours, onSubmitEditing }, ref) => {
    function onChange(hours: string, minutes: string, seconds: string) {
      const totalSeconds = +hours * 3600 + +minutes * 60 + +seconds
      onUpdate(totalSeconds)
    }

    const hours = Math.floor(valueSeconds / 3600)
    const hoursStr = hours !== 0 ? `${hours}` : ''
    const minutes = Math.floor((valueSeconds % 3600) / 60)
    const minutesStr = minutes !== 0 ? `${minutes}` : ''
    const seconds = valueSeconds % 60
    const secondsStr = seconds !== 0 ? `${seconds}` : ''

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
            <TextInput
              value={hoursStr}
              style={{ textAlign: 'center' }}
              inputMode="numeric"
              multiline={false}
              keyboardType="number-pad"
              onChangeText={text => {
                onChange(text, minutesStr, secondsStr)
              }}
              placeholder="hh"
              maxLength={2}
              ref={input1}
              returnKeyType="next"
              onSubmitEditing={() => onHandleSubmit(input1)}
            />
            <Text style={{ fontSize: fontSize.xs }}>:</Text>
          </>
        )}
        <TextInput
          value={minutesStr}
          style={{ textAlign: 'center' }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={text => {
            const newMinutes = Math.floor(Number(text))
            if (newMinutes <= 59) {
              onChange(hoursStr, text, secondsStr)
            }
          }}
          placeholder="mm"
          maxLength={2}
          ref={input2}
          returnKeyType="next"
          onSubmitEditing={() => onHandleSubmit(input2)}
        />
        <Text style={{ fontSize: fontSize.xs }}>:</Text>
        <TextInput
          value={secondsStr}
          style={{ textAlign: 'center' }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={text => {
            const newSecs = Math.floor(Number(text))
            if (newSecs <= 59) {
              onChange(hoursStr, minutesStr, text)
            }
          }}
          placeholder="ss"
          maxLength={2}
          ref={input3}
          onSubmitEditing={() => onHandleSubmit(input3)}
        />
      </View>
    )
  }
)

export default DurationInput
