import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import { BodyLargeLabel, colors, Icon } from 'designSystem'

type Props = {
  onPress: () => void
  text?: string
}

const SelectButton: React.FC<Props> = ({ onPress, text }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.primaryLight,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // gap: 4,
        }}
      >
        <BodyLargeLabel>{text}</BodyLargeLabel>
        <View style={{ marginLeft: 4 }}>
          <Icon
            icon="chevron-down"
            size="small"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SelectButton
