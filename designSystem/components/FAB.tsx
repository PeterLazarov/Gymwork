import React from 'react'
import { FAB as FABPaper, FABProps } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'

const FAB: React.FC<FABProps> = ({ style, disabled, ...otherProps }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <FABPaper
      style={[
        {
          position: 'absolute',
          right: 'auto',
          left: 'auto',
          backgroundColor: disabled ? colors.surfaceVariant : colors.primary,
          cursor: 'pointer',
        },
        style,
      ]}
      disabled={disabled}
      color={colors.onPrimary}
      {...otherProps}
    />
  )
}

export default FAB
