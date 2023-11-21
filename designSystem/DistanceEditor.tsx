import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import Dropdown from './Dropdown'

type Props = {
  value: number
  unit: string
  onChange: (selected: number) => void
}

const DistanceEditor: React.FC<Props> = ({ value, unit, onChange }) => {
  function onSelect(value: string) {}
  return (
    <View style={{ flexDirection: 'row' }}>
      <TextInput
        style={{ textAlign: 'center' }}
        inputMode="numeric"
        keyboardType="number-pad"
        onChangeText={text => {
          onChange(isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0))
        }}
        maxLength={3}
      >
        {value}
      </TextInput>
      <Dropdown
        options={[unit]}
        selectedOption={unit}
        onSelect={onSelect}
        containerStyle={{ height: 20 }}
      />
    </View>
  )
}

export default DistanceEditor
