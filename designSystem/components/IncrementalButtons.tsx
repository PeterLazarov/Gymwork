import React from 'react'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'

import { Icon } from '.'

export type IncrementalButtonsProps = {
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
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  const btnStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primary,
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <TouchableOpacity
        onPress={() =>
          onChange(isInvalidNumber(value) ? 0 : value - (step ?? 1))
        }
        style={btnStyle}
      >
        <Icon
          icon="remove"
          color={colors.onPrimary}
        />
      </TouchableOpacity>
      <View style={{ flexGrow: 1, paddingHorizontal: 4 }}>{children}</View>
      <TouchableOpacity
        onPress={() =>
          onChange(isInvalidNumber(value) ? 0 : value + (step ?? 1))
        }
        style={btnStyle}
      >
        <Icon
          icon="add"
          color={colors.onPrimary}
        />
      </TouchableOpacity>
    </View>
  )
}

export default IncrementalButtons
