import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'

import { colors, fontSize, Icon } from 'designSystem'

type Props = {
  onPress: () => void
  text?: string
  error?: boolean
  label?: string
}

const SelectButton: React.FC<Props> = ({ onPress, text, error, label }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.primaryLighter,
          paddingHorizontal: 15,
          paddingVertical: label ? 9 : 17,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderTopStartRadius: 4,
          borderTopEndRadius: 4,
          borderBottomWidth: 0.3,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          {label && (
            <Text
              style={{
                fontSize: fontSize.xs,
                opacity: 0.75,
              }}
            >
              {label}
            </Text>
          )}
          <Text
            style={{
              fontSize: fontSize.md,
              color: error ? colors.critical : colors.neutralText,
            }}
          >
            {text}
          </Text>
        </View>
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
