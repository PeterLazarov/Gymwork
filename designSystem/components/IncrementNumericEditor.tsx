import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'

import { IncrementalButtons, NumberInput } from 'designSystem'

type _IncrementNumericEditor = {
  value?: number
  onChange?: (value: number | undefined) => void
  step?: number
  returnKeyType?: TextInputProps['returnKeyType']
  maxDecimals?: number
}

type IncrementNumericEditorProps = _IncrementNumericEditor &
  Omit<TextInputProps, keyof _IncrementNumericEditor>

const IncrementNumericEditor = forwardRef<
  typeof TextInput,
  IncrementNumericEditorProps
>(function IncrementNumericEditor(
  { value, onChange, step, returnKeyType, maxDecimals, ...rest },
  ref
) {
  return (
    <IncrementalButtons
      value={value ?? 0}
      onChange={n => {
        onChange?.(Math.max(n, 0))
      }}
      step={step}
    >
      <NumberInput
        dense
        onChange={onChange}
        value={value}
        ref={ref}
        returnKeyType={returnKeyType}
        textAlign="center"
        maxDecimals={maxDecimals}
        style={{
          textAlign: 'center',
        }}
        {...rest}
      />
    </IncrementalButtons>
  )
})

export default IncrementNumericEditor
