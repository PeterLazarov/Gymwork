import React from 'react'

import { colors } from './tokens'
import {
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native-gesture-handler'

type Props = TouchableHighlightProps & {
  underlay?: 'default' | 'darker'
}

const underlayColors = {
  default: colors.primaryLighter,
  darker: colors.primaryLight,
}
const PressableHighlight: React.FC<Props> = ({
  underlay = 'default',
  ...props
}) => (
  <TouchableHighlight
    underlayColor={underlayColors[underlay]}
    activeOpacity={0.6}
    {...props}
  />
)

export default PressableHighlight
