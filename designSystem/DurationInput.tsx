import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

type Props = {
  valueSeconds: number
  onUpdate: (seconds: number) => void
  hideHours?: boolean
}

const DurationPicker: React.FC<Props> = ({
  valueSeconds,
  onUpdate,
  hideHours,
}) => {
  function onChange(hours: number, minutes: number, seconds: number) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    onUpdate(totalSeconds)
  }

  const hours = Math.floor(valueSeconds / 3600)
  const minutes = Math.floor((valueSeconds % 3600) / 60)
  const seconds = valueSeconds % 60

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
      {!hideHours && (
        <TextInput
          value={`${hours}`}
          style={{ textAlign: 'center' }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={text => {
            const newHours = Math.floor(Number(text))
            onChange(newHours, minutes, seconds)
          }}
          placeholder="hh"
          maxLength={2}
        />
      )}
      <TextInput
        value={`${minutes}`}
        style={{ textAlign: 'center' }}
        inputMode="numeric"
        multiline={false}
        keyboardType="number-pad"
        onChangeText={text => {
          const newMinutes = Math.floor(Number(text))
          if (newMinutes <= 59) {
            onChange(hours, newMinutes, seconds)
          }
        }}
        placeholder="mm"
        maxLength={2}
      />
      <TextInput
        value={`${seconds}`}
        style={{ textAlign: 'center' }}
        inputMode="numeric"
        multiline={false}
        keyboardType="number-pad"
        onChangeText={text => {
          const newSecs = Math.floor(Number(text))
          if (newSecs <= 59) {
            onChange(hours, minutes, newSecs)
          }
        }}
        placeholder="ss"
        maxLength={2}
      />
    </View>
  )
}

export default DurationPicker
