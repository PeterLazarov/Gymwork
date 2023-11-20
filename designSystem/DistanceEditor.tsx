import { TextInput } from 'react-native-paper'

type Props = {
  value: number
  unit: string
  onChange: (selected: number) => void
}

const DistanceEditor: React.FC<Props> = ({ value, unit, onChange }) => {
  return (
    <TextInput
      style={{ flexGrow: 1, textAlign: 'center' }}
      inputMode="numeric"
      multiline={false}
      keyboardType="number-pad"
      onChangeText={text => {
        onChange(isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0))
      }}
      maxLength={3}
    >
      {value}
    </TextInput>
  )
}

export default DistanceEditor
