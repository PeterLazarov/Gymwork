import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { BodySmallLabel, colors } from 'designSystem'

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
        justifyContent: 'flex-end',
      }}
    >
      <BodySmallLabel
        style={{
          fontWeight: 'bold',
          color,
        }}
      >
        {value}
      </BodySmallLabel>
      {unit && (
        <BodySmallLabel
          style={{
            color,
          }}
        >
          {unit}
        </BodySmallLabel>
      )}
    </View>
  )
}

export default observer(SetDataLabel)
