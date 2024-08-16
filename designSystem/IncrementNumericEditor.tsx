import React from 'react'
import { TextInput } from 'react-native'

import IncrementDecrementButtons from '../app/components/IncrementDecrementButtons'

type Props = {
  value: number
  onChange: (value: number) => void
  step?: number
}

const IncrementNumericEditor: React.FC<Props> = ({ value, onChange, step }) => {
  return (
    <IncrementDecrementButtons
      value={value}
      onChange={n => onChange(Math.max(n, 0))}
      step={step}
    >
      <TextInput
        style={{ flexGrow: 1, textAlign: 'center', fontSize: 16 }}
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
    </IncrementDecrementButtons>
  )
}

export default IncrementNumericEditor
