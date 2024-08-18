import { forwardRef } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import { Select } from './Select'
import DistanceType from 'app/enums/DistanceType'

type _Props = {
  value: number
  unit: string
  onChange: (selected: number) => void
  onUnitChange: (unit: string) => void
}
export type DistanceEditorProps = _Props & Omit<TextInputProps, keyof _Props>

const DistanceEditor = forwardRef<TextInput, DistanceEditorProps>(
  ({ value, unit, onChange, onUnitChange, ...rest }, ref) => {
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
          ref={ref}
          {...rest}
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
)

export default DistanceEditor
