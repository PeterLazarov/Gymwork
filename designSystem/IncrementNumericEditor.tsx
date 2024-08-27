import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'

import IncrementalButtons from 'app/components/IncrementalButtons'
import NumberInput from 'app/components/NumberInput'

type Props = {
  value: number
  onChange: (value: number) => void
  onSubmit?: TextInputProps['onSubmitEditing']
  step?: number
  returnKeyType?: TextInputProps['returnKeyType']
}

const IncrementNumericEditor = forwardRef<TextInput, Props>(
  ({ value, onChange, step, onSubmit, returnKeyType }, ref) => {
    return (
      <IncrementalButtons
        value={value}
        onChange={n => {
          onChange(Math.max(n, 0))
        }}
        step={step}
      >
        <NumberInput
          onChange={onChange}
          value={value}
          onSubmit={onSubmit}
          ref={ref}
          returnKeyType={returnKeyType}
          textAlign="center"
          style={{
            textAlign: 'center',
          }}
        />
      </IncrementalButtons>
    )
  }
)

export default IncrementNumericEditor
