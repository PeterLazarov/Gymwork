import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

import { Select } from './Select'
import DistanceType from 'app/enums/DistanceType'

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
        maxLength={5}
      />
      <Select
        options={Object.values(DistanceType)}
        value={unit}
        onChange={onUnitChange}
        containerStyle={{ flex: 1 }}
      />
    </View>
  )
}

export default DistanceEditor
