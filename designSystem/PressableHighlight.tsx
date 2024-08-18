import React from 'react'
import {
  TouchableHighlight,
  TouchableHighlightProps,
  ViewStyle,
} from 'react-native'

import { colors } from './tokens'

type Props = Omit<TouchableHighlightProps, 'style'> & {
  variant?: 'default' | 'icon'
  style?: ViewStyle
}
const PressableHighlight: React.FC<Props> = ({
  variant = 'default',
  style,
  ...props
}) => (
  <TouchableHighlight
    underlayColor={colors.primaryLighter}
    activeOpacity={0.6}
    style={{
      borderRadius: variant === 'icon' ? 999 : 0,
      padding: variant === 'icon' ? 4 : 0,
      ...style,
    }}
    {...props}
  />
)

export default PressableHighlight
