import React, { forwardRef, useEffect, useState } from "react"
import { TextInput as TextInputRN } from "react-native"
import { TextInput, TextInputProps } from "react-native-paper"

import { useColors } from "../tokens/colors"

type _NumberInputProps = {
  value?: number | null
  onChange?: (value: number | undefined) => void
  //   onSubmit?: TextInputProps['onSubmitEditing']
  //   returnKeyType?: TextInputProps['returnKeyType']

  maxDigits?: number
  maxDecimals?: number
  maxLength?: number
}

export type NumberInputProps = _NumberInputProps & Omit<TextInputProps, keyof _NumberInputProps>

const defaultMaxDigits = 4
const defaultMaxDecimals = 2
const defaultMaxLength = defaultMaxDigits + defaultMaxDecimals + 1

export const NumberInput = forwardRef<TextInputRN, NumberInputProps>(
  (
    {
      value,
      onChange,
      style,

      maxDigits = defaultMaxDigits,
      maxDecimals = defaultMaxDecimals,
      maxLength = defaultMaxLength,

      ...rest
    },
    ref,
  ) => {
    const colors = useColors()
    const [rendered, setRendered] = useState(String(value) ?? "")

    useEffect(() => {
      if (value === Infinity || value === -Infinity) {
        setRendered("∞")
        return
      }

      if (Number(rendered) !== value) {
        setRendered(
          value !== undefined && value !== null
            ? String(value.toFixed(String(value).includes(".") ? maxDecimals : 0))
            : "",
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
        onChangeText={(text) => {
          if (text === ".") {
            text = "0."
          }
          if (text === "" || isNaN(Number(text))) {
            setRendered("")
            onChange?.(undefined)
            return
          }

          const toFixed = text
            .replace(/^0+(?=[0-9])/, "") 
            .slice(
              0,
              text.includes(".")
                ? Math.min(text.indexOf(".") + maxDecimals + 1, maxLength)
                : maxDigits,
            )

          setRendered(toFixed)

          onChange?.(Number(toFixed))
        }}
        value={rendered}
      />
    )
  },
)
