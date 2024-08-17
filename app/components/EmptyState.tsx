import React from 'react'
import { View, Text } from 'react-native'

import { colors } from 'designSystem'

type Props = {
  text: string
}
const EmptyState: React.FC<Props> = ({ text }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 10,
    }}
  >
    <Text style={{ color: colors.gray, fontSize: 30 }}>{text}</Text>
  </View>
)

export default EmptyState
