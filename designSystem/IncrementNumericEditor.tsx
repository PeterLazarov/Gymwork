import React, { useEffect, useState, forwardRef } from 'react'
import { TextInput } from 'react-native'
import { TextInputProps } from 'react-native-paper'

import IncrementalButtons from 'app/components/IncrementalButtons'
import { fontSize } from './tokens'

type Props = {
  value: number
  onChange: (value: number) => void
  onSubmit?: TextInputProps['onSubmitEditing']
  step?: number
  returnKeyType?: TextInputProps['returnKeyType']
}

const maxDigits = 4
const maxDecimals = 2
const maxLength = maxDigits + maxDecimals + 1

const IncrementNumericEditor = forwardRef<TextInput, Props>(
  ({ value, onChange, step, onSubmit, returnKeyType }, ref) => {
    const [rendered, setRendered] = useState(String(value) ?? '')

    useEffect(() => {
      if (Number(rendered) !== value) {
        setRendered(
          String(value.toFixed(String(value).includes('.') ? maxDecimals : 0))
        )
      }
    })

    return (
      <IncrementalButtons
        value={value}
        onChange={n => onChange(Math.max(n, 0))}
        step={step}
      >
        <TextInput
          style={{ flexGrow: 1, textAlign: 'center', fontSize: fontSize.md }}
          multiline={false}
          keyboardType="decimal-pad"
          onSubmitEditing={onSubmit}
          ref={ref}
          onChangeText={text => {
            const asNum = Number(text)
            if (isNaN(asNum)) {
              return
            }

            // Strip leading zeroes, enforce max length
            const toFixed = text
              .replace(/^0+/, '')
              .slice(
                0,
                text.includes('.')
                  ? Math.min(text.indexOf('.') + maxDecimals + 1, maxLength)
                  : maxDigits
              )
            setRendered(toFixed)

            onChange(Number(toFixed))
          }}
          value={rendered}
          returnKeyType={returnKeyType}
        />
      </IncrementalButtons>
    )
  }
)

export default IncrementNumericEditor
