import React from 'react'
import { View, Text } from 'react-native'

import { fontSize, useColors } from 'designSystem'

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
          color: colors.neutralDarker,
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
