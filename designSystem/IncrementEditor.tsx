import React from 'react'
import { View, TextInput } from 'react-native'

import { Divider } from './Divider'
import { SubSectionLabel } from './Label'
import IncrementDecrementButtons from '../components/IncrementDecrementButtons'

type Props = {
  text: string
  value: number
  onChange: (value: number) => void
  step?: number
}

const IncrementEditor: React.FC<Props> = ({ text, value, onChange, step }) => {
  return (
    <View style={{ gap: 16 }}>
      <View>
        <SubSectionLabel style={{ textTransform: 'uppercase' }}>
          {text}
        </SubSectionLabel>
        <Divider />
      </View>
      <IncrementDecrementButtons
        value={value}
        onChange={n => onChange(Math.max(n, 0))}
        step={step}
      >
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
      </IncrementDecrementButtons>
    </View>
  )
}

export default IncrementEditor
