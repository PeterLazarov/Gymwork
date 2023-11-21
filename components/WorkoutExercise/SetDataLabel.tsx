import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import colors from '../../designSystem/colors'

type Props = {
  value: string | number
  unit?: string
  isFocused?: boolean
}

const ReadOnlyListItemDataLabel: React.FC<Props> = ({
  value,
  unit,
  isFocused,
}) => {
  const color = isFocused ? colors.primary : colors.secondaryText
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
      <Text
        style={{
          fontWeight: 'bold',
          color,
        }}
      >
        {value}
      </Text>
      {unit && (
        <Text
          style={{
            color,
          }}
        >
          {unit}
        </Text>
      )}
    </View>
  )
}

export default observer(ReadOnlyListItemDataLabel)
