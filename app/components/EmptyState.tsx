import React from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Text } from 'designSystem'

export type EmptyStateProps = {
  text: string
}
const EmptyState: React.FC<EmptyStateProps> = ({ text }) => {
  const {
    theme: {
      colors,
      spacing,
      typography: { fontSize },
    },
  } = useAppTheme()

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: spacing.sm,
        padding: spacing.sm,
      }}
    >
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: fontSize.xl,
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

export default EmptyState
