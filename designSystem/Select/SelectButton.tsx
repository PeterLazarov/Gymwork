import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'

import { Text, useColors, fontSize, Icon } from 'designSystem'

type Props = {
  onPress: () => void
  text?: string
  error?: boolean
  label?: string
}

const SelectButton: React.FC<Props> = ({ onPress, text, error, label }) => {
  const colors = useColors()

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.mat.surfaceContainerLow,
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
              color: error ? colors.mat.onError : colors.mat.onSurface,
            }}
          >
            {text}
          </Text>
        </View>
        <Icon
          icon="chevron-down"
          size="small"
          style={{ marginLeft: 4 }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SelectButton
