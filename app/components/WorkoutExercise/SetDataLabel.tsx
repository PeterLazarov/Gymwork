import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'

import { colors, fontSize } from 'designSystem'

type Props = {
  value: string | number
  unit?: string
  isFocused?: boolean
}

const SetDataLabel: React.FC<Props> = ({ value, unit, isFocused }) => {
  const color = isFocused ? colors.primary : colors.secondaryText
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          color,
          fontSize: fontSize.xs,
        }}
      >
        {value}
      </Text>
      {unit && (
        <Text
          style={{
            color,
            fontSize: fontSize.xs,
          }}
        >
          {unit}
        </Text>
      )}
    </View>
  )
}

export default observer(SetDataLabel)
