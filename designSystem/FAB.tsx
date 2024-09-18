import React from 'react'
import { FAB as FABPaper, FABProps } from 'react-native-paper'

import { useColors } from './tokens'

const FAB: React.FC<FABProps> = ({ style, disabled, ...otherProps }) => {
  const colors = useColors()

  return (
    <FABPaper
      style={[
        {
          position: 'absolute',
          margin: 16,
          right: 'auto',
          left: 'auto',
          bottom: 0,
          backgroundColor: disabled
            ? colors.mat.surfaceVariant
            : colors.mat.primary,
        },
        style,
      ]}
      disabled={disabled}
      color={colors.mat.onPrimary}
      {...otherProps}
    />
  )
}

export default FAB
