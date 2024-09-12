import { forwardRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import convert from 'convert-units'

import { Select } from './Select'
import { DistanceUnit, measurementUnits } from 'app/db/models'
import { NumberInput, NumberInputProps } from 'designSystem'

type _Props = {
  value: number
  unit: DistanceUnit
  onChange: (selected: number) => void
}
export type DistanceEditorProps = _Props & Omit<NumberInputProps, keyof _Props>

const DistanceEditor = forwardRef<TextInput, DistanceEditorProps>(
  ({ value, unit, onChange, ...rest }, ref) => {
    const [internalUnit, setInternalUnit] = useState<DistanceUnit>(unit)

    const formattedDistance = convert(value).from(unit).to(internalUnit)

    function onChangeInternal(distance: number) {
      const standardizedValue = convert(distance).from(internalUnit).to(unit)

      onChange(standardizedValue)
    }

    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <NumberInput
          value={formattedDistance}
          style={{ textAlign: 'center', flex: 1.5 }}
          onChange={onChangeInternal}
          maxLength={5}
          ref={ref}
          {...rest}
        />
        <Select
          options={Object.values(measurementUnits.distance)}
          value={internalUnit}
          onChange={unit => setInternalUnit(unit as DistanceUnit)}
          containerStyle={{ height: 'auto' }}
        />
      </View>
    )
  }
)

export default DistanceEditor
