import React from 'react'
import { FAB as FABPaper, FABProps } from 'react-native-paper'

import { colors } from './tokens'

const FAB: React.FC<FABProps> = ({ style, ...otherProps }) => {
  return (
    <FABPaper
      style={[
        {
          position: 'absolute',
          margin: 16,
          right: 'auto',
          left: 'auto',
          bottom: 0,
          backgroundColor: colors.primary,
        },
        style,
      ]}
      color={colors.primaryText}
      {...otherProps}
    />
  )
}

export default FAB
