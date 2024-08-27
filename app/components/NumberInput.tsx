import React, { forwardRef, useEffect, useState } from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'

type _NumberInputProps = {
  value: number
  onChange: (value: number) => void
  //   onSubmit?: TextInputProps['onSubmitEditing']
  //   returnKeyType?: TextInputProps['returnKeyType']

  maxDigits?: number
  maxDecimals?: number
  maxLength?: number
}

type NumberInputProps = _NumberInputProps &
  Omit<TextInputProps, keyof _NumberInputProps>

const defaultMaxDigits = 4
const defaultMaxDecimals = 2
const defaultMaxLength = defaultMaxDigits + defaultMaxDecimals + 1

const NumberInput = forwardRef<typeof TextInput, NumberInputProps>(
  (
    {
      value,
      onChange,

      maxDigits = defaultMaxDigits,
      maxDecimals = defaultMaxDecimals,
      maxLength = defaultMaxLength,

      ...rest
    },
    ref
  ) => {
    const [rendered, setRendered] = useState(String(value) ?? '')

    useEffect(() => {
      if (Number(rendered) !== value) {
        setRendered(
          String(value.toFixed(String(value).includes('.') ? maxDecimals : 0))
        )
      }
    })

    return (
      <TextInput
        {...rest}
        multiline={false}
        keyboardType="decimal-pad"
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
      />
    )
  }
)

export default NumberInput
