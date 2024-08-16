import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'

import IncrementDecrementButtons from '../app/components/IncrementDecrementButtons'

type Props = {
  value: number
  onChange: (value: number) => void
  step?: number
}

const maxDigits = 4
const maxDecimals = 2
const maxLength = maxDigits + maxDecimals + 1

const IncrementNumericEditor: React.FC<Props> = ({ value, onChange, step }) => {
  const [rendered, setRendered] = useState(String(value) ?? '')

  useEffect(() => {
    if (Number(rendered) !== value) {
      setRendered(
        String(value.toFixed(String(value).includes('.') ? maxDecimals : 0))
      )
    }
  })

  return (
    <IncrementDecrementButtons
      value={value}
      onChange={n => onChange(Math.max(n, 0))}
      step={step}
    >
      <TextInput
        style={{ flexGrow: 1, textAlign: 'center', fontSize: 16 }}
        multiline={false}
        keyboardType="decimal-pad"
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
      />
    </IncrementDecrementButtons>
  )
}

export default IncrementNumericEditor
