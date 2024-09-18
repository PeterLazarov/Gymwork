import React from 'react'

import { useColors } from './tokens'
import { TouchableHighlight, TouchableHighlightProps } from 'react-native'

type Props = TouchableHighlightProps & {
  underlay?: 'default' | 'darker'
}

const PressableHighlight: React.FC<Props> = ({
  underlay = 'default',
  ...props
}) => {
  const colors = useColors()

  const underlayColors = {
    default: colors.mat.primaryContainer,
    darker: colors.mat.inversePrimary,
  }

  return (
    <TouchableHighlight
      underlayColor={underlayColors[underlay]}
      activeOpacity={0.6}
      {...props}
    />
  )
}

export default PressableHighlight
