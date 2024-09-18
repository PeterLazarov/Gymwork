import React from 'react'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'

import { Icon, useColors } from '.'

type Props = {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
  step?: number
}

const IncrementalButtons: React.FC<Props> = ({
  value,
  onChange,
  children,
  step,
}) => {
  const colors = useColors()

  const btnStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primaryContainer,
    padding: 7,
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
        onPress={() => onChange(value - (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="remove"
          color={colors.onPrimaryContainer}
        />
      </TouchableOpacity>
      <View style={{ flexGrow: 1, paddingHorizontal: 4 }}>{children}</View>
      <TouchableOpacity
        onPress={() => onChange(value + (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="add"
          color={colors.onPrimaryContainer}
        />
      </TouchableOpacity>
    </View>
  )
}

export default IncrementalButtons
