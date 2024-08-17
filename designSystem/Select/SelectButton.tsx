import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'

import { colors, fontSize, Icon } from 'designSystem'

type Props = {
  onPress: () => void
  text?: string
  error?: boolean
}

const SelectButton: React.FC<Props> = ({ onPress, text, error }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.primaryLighter,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // gap: 4,
        }}
      >
        <Text
          style={{
            fontSize: fontSize.md,
            color: error ? colors.critical : colors.secondaryText,
          }}
        >
          {text}
        </Text>
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
