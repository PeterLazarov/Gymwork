import React from 'react'
import { TouchableHighlight, TouchableHighlightProps } from 'react-native'

import { colors } from './tokens'

const PressableHighlight: React.FC<TouchableHighlightProps> = props => (
  <TouchableHighlight
    underlayColor={colors.primaryLighter}
    activeOpacity={0.6}
    {...props}
  />
)

export default PressableHighlight
