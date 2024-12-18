import React, { forwardRef, useEffect, useState } from 'react'
import { TextInput as TextInputRN } from 'react-native'
import { TextInput, TextInputProps } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'

type _NumberInputProps = {
  value?: number
  onChange?: (value: number | undefined) => void
  //   onSubmit?: TextInputProps['onSubmitEditing']
  //   returnKeyType?: TextInputProps['returnKeyType']

  maxDigits?: number
  maxDecimals?: number
  maxLength?: number
}

export type NumberInputProps = _NumberInputProps &
  Omit<TextInputProps, keyof _NumberInputProps>

const defaultMaxDigits = 4
const defaultMaxDecimals = 2
const defaultMaxLength = defaultMaxDigits + defaultMaxDecimals + 1

export const NumberInput = forwardRef<TextInputRN, NumberInputProps>(
  function NumberInput(
    {
      value,
      onChange,
      style,

      maxDigits = defaultMaxDigits,
      maxDecimals = defaultMaxDecimals,
      maxLength = defaultMaxLength,

      ...rest
    },
    ref
  ) {
    const {
      theme: { colors },
    } = useAppTheme()
    const [rendered, setRendered] = useState(String(value) ?? '')

    useEffect(() => {
      if (value === Infinity || value === -Infinity) {
        setRendered('∞')
        return
      }

      if (Number(rendered) !== value) {
        setRendered(
          value !== undefined
            ? String(
                value.toFixed(String(value).includes('.') ? maxDecimals : 0)
              )
            : ''
        )
      }
    }, [value])

    return (
      <TextInput
        {...rest}
        multiline={false}
        keyboardType="decimal-pad"
        ref={ref}
        style={[{ borderWidth: 0 }, style]}
        contentStyle={{ borderWidth: 0 }}
        underlineStyle={{ borderWidth: 0 }}
        underlineColor={colors.tertiary}
        onChangeText={text => {
          if (text === '') {
            setRendered('')
            onChange?.(undefined)
            return
          }
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

          onChange?.(Number(toFixed))
        }}
        value={rendered}
      />
    )
  }
)
