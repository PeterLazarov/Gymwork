import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Icon, PressableHighlight, useColors } from '.'

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
    backgroundColor: colors.mat.primaryContainer,
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
      <PressableHighlight
        onPress={() => onChange(value - (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="remove"
          color={colors.mat.onPrimaryContainer}
        />
      </PressableHighlight>
      <View style={{ flexGrow: 1, paddingHorizontal: 4 }}>{children}</View>
      <PressableHighlight
        onPress={() => onChange(value + (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="add"
          color={colors.mat.onPrimaryContainer}
        />
      </PressableHighlight>
    </View>
  )
}

export default IncrementalButtons
