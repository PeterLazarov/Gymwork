import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'

import { IncrementalButtons, NumberInput } from 'designSystem'

type Props = {
  value: number
  onChange: (value: number) => void
  onSubmit?: TextInputProps['onSubmitEditing']
  step?: number
  returnKeyType?: TextInputProps['returnKeyType']
  maxDecimals?: number
}

const IncrementNumericEditor = forwardRef<TextInput, Props>(
  ({ value, onChange, step, onSubmit, returnKeyType, maxDecimals }, ref) => {
    return (
      <IncrementalButtons
        value={value}
        onChange={n => {
          onChange(Math.max(n, 0))
        }}
        step={step}
      >
        <NumberInput
          dense
          onChange={onChange}
          value={value}
          onSubmit={onSubmit}
          ref={ref}
          returnKeyType={returnKeyType}
          textAlign="center"
          maxDecimals={maxDecimals}
          style={{
            textAlign: 'center',
          }}
        />
      </IncrementalButtons>
    )
  }
)

export default IncrementNumericEditor
