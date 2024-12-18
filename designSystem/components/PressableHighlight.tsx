import React from 'react'
import { TouchableHighlight, TouchableHighlightProps } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'

type Props = TouchableHighlightProps & {
  underlay?: 'default' | 'darker'
}

const PressableHighlight: React.FC<Props> = ({
  underlay = 'default',
  ...props
}) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const underlayColors = {
    default: colors.primaryContainer,
    darker: colors.inversePrimary,
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
