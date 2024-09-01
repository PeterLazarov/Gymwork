import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'

import { colors, fontSize as fontSizeToken } from 'designSystem'

type Props = {
  value: string | number
  unit?: string
  isFocused?: boolean
  fontSize?: keyof typeof fontSizeToken
}

const SetDataLabel: React.FC<Props> = ({
  value,
  unit,
  isFocused,
  fontSize,
}) => {
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
          color: isFocused ? colors.secondary : colors.neutralText,
          fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
        }}
      >
        {value}
      </Text>
      {unit && (
        <Text
          style={{
            color: isFocused ? colors.secondary : colors.neutralDark,
            fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
          }}
        >
          {unit}
        </Text>
      )}
    </View>
  )
}

export default observer(SetDataLabel)
