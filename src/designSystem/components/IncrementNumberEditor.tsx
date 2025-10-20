import React, { forwardRef } from "react"
import { TextInput, TextInputProps } from "react-native-paper"

import { Icon, NumberInput, spacing, useColors } from "@/designSystem"
import { Pressable, StyleProp, View, ViewStyle, TextInput as TextInputRN } from "react-native"

type _IncrementNumberEditor = {
  value?: number
  onChange?: (value: number | undefined) => void
  step?: number
  returnKeyType?: TextInputProps["returnKeyType"]
  maxDecimals?: number
}

type IncrementNumberEditorProps = _IncrementNumberEditor &
  Omit<TextInputProps, keyof _IncrementNumberEditor>

export const IncrementNumericEditor = forwardRef<TextInputRN, IncrementNumberEditorProps>(
  ({ value, onChange, step, returnKeyType, maxDecimals, ...rest }, ref) => {
    return (
      <IncrementalButtons
        value={value ?? 0}
        onChange={(n) => {
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
            textAlign: "center",
          }}
          {...rest}
        />
      </IncrementalButtons>
    )
  },
)

type IncrementalButtonsProps = {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
  step?: number
}

function isInvalidNumber(value?: number) {
  return [NaN, Infinity, -Infinity, undefined].includes(value)
}

const IncrementalButtons: React.FC<IncrementalButtonsProps> = ({
  value,
  onChange,
  children,
  step,
}) => {
  const colors = useColors()

  const btnStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary,
    padding: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Pressable
        onPress={() => onChange(isInvalidNumber(value) ? 0 : value - (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="remove"
          color={colors.onPrimary}
        />
      </Pressable>
      <View style={{ flexGrow: 1, paddingHorizontal: 4 }}>{children}</View>
      <Pressable
        onPress={() => onChange(isInvalidNumber(value) ? 0 : value + (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="add"
          color={colors.onPrimary}
        />
      </Pressable>
    </View>
  )
}
