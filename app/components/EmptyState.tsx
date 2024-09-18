import React from 'react'
import { View } from 'react-native'

import { Text, fontSize, useColors } from 'designSystem'

type Props = {
  text: string
}
const EmptyState: React.FC<Props> = ({ text }) => {
  const colors = useColors()

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 10,
        padding: 10,
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
