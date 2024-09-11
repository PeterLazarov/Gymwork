import React from 'react'
import { FAB as FABPaper, FABProps } from 'react-native-paper'

import { colors } from './tokens'

const FAB: React.FC<FABProps> = ({ style, disabled, ...otherProps }) => {
  return (
    <FABPaper
      style={[
        {
          position: 'absolute',
          margin: 16,
          right: 'auto',
          left: 'auto',
          bottom: 0,
          backgroundColor: disabled ? colors.neutral : colors.primary,
        },
        style,
      ]}
      disabled={disabled}
      color={colors.primaryText}
      {...otherProps}
    />
  )
}

export default FAB
