import { fontSize } from 'designSystem'
import { View, Text } from 'react-native'
import { TextInput } from 'react-native-paper'

type Props = {
  valueSeconds: number
  onUpdate: (seconds: number) => void
  hideHours?: boolean
}

const DurationInput: React.FC<Props> = ({
  valueSeconds,
  onUpdate,
  hideHours,
}) => {
  function onChange(hours: string, minutes: string, seconds: string) {
    const totalSeconds = +hours * 3600 + +minutes * 60 + +seconds
    onUpdate(totalSeconds)
  }

  const hours = Math.floor(valueSeconds / 3600)
  const hoursStr = hours !== 0 ? `${hours}` : ''
  const minutes = Math.floor((valueSeconds % 3600) / 60)
  const minutesStr = minutes !== 0 ? `${minutes}` : ''
  const seconds = valueSeconds % 60
  const secontdsStr = seconds !== 0 ? `${seconds}` : ''

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
              onChange(text, minutesStr, secontdsStr)
            }}
            placeholder="hh"
            maxLength={2}
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
            onChange(hoursStr, text, secontdsStr)
          }
        }}
        placeholder="mm"
        maxLength={2}
      />
      <Text style={{ fontSize: fontSize.xs }}>:</Text>
      <TextInput
        value={secontdsStr}
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
      />
    </View>
  )
}

export default DurationInput
