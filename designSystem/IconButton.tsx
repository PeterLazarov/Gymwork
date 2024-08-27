import React from 'react'
import { TouchableHighlightProps, ViewStyle } from 'react-native'

import { PressableHighlight } from '.'

const sizes = {
  sm: 24,
  md: 42,
  lg: 68,
}
type Props = Omit<TouchableHighlightProps, 'style'> & {
  style?: ViewStyle
  size?: keyof typeof sizes
  underlay?: 'default' | 'darker'
}
const IconButton: React.FC<Props> = ({
  style,
  size = 'md',
  underlay = 'default',
  ...props
}) => (
  <PressableHighlight
    style={{
      flexGrow: 0,
      height: sizes[size],
      width: sizes[size],
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
    underlay={underlay}
    {...props}
  />
)

export default IconButton
