import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import Dropdown from './Dropdown'
import DistanceType from '../enums/DistanceType'

type Props = {
  value: number
  unit: string
  onChange: (selected: number) => void
  onUnitChange: (unit: string) => void
}

const DistanceEditor: React.FC<Props> = ({
  value,
  unit,
  onChange,
  onUnitChange,
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 24 }}>
      <TextInput
        value={`${value}`}
        style={{ textAlign: 'center', flex: 1.5 }}
        inputMode="numeric"
        keyboardType="number-pad"
        onChangeText={text => {
          onChange(isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0))
        }}
        maxLength={3}
      />
      <Dropdown
        options={Object.values(DistanceType)}
        selectedOption={unit}
        onSelect={onUnitChange}
        containerStyle={{ flex: 1 }}
      />
    </View>
  )
}

export default DistanceEditor
