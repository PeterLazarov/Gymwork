import React from 'react'
import { Platform, View, Text } from 'react-native'

import { Icon, IconButton, IconProps, colors, fontSize } from '..'

export type FeedbackOption = {
  icon: IconProps['icon']
  label: string
  color: string
  value: string
}
type Props = {
  isSelected?: boolean
  onPress: (feeling: string) => void
  option: FeedbackOption
}
const FeedbackPickerOption: React.FC<Props> = ({
  option,
  onPress,
  isSelected,
}) => {
  return (
    <View
      key={option.value}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isSelected ? colors.neutralLightest : 'transparent',
        borderRadius: 8,
        padding: 8,
      }}
    >
      <IconButton
        size="lg"
        onPress={() => onPress(option.value)}
      >
        <Icon
          icon={option.icon}
          size="large"
          color={isSelected ? option.color : colors.neutralDarker}
        />
      </IconButton>
      <Text
        style={{
          fontSize: fontSize.sm,
          color: isSelected ? option.color : colors.neutralDarker,
          fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
        }}
      >
        {option.label}
      </Text>
    </View>
  )
}

export default FeedbackPickerOption