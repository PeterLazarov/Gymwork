import React from 'react'
import { Platform, View } from 'react-native'

import { Text, Icon, IconButton, IconProps, useColors, fontSize } from '..'

export type FeedbackOption = {
  icon: IconProps['icon']
  label: string
  color: string
  value: string
}
type Props = {
  isSelected?: boolean
  onPress?: (feeling: string) => void
  option: FeedbackOption
  noPadding?: boolean
}
const FeedbackPickerOption: React.FC<Props> = ({
  option,
  onPress,
  isSelected,
  noPadding,
}) => {
  const colors = useColors()

  return (
    <View
      key={option.value}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isSelected
          ? colors.mat.surfaceContainerLowest
          : 'transparent',
        borderRadius: 8,
        padding: noPadding ? 0 : 8,
      }}
    >
      <IconButton
        size="lg"
        onPress={() => onPress?.(option.value)}
      >
        <Icon
          icon={option.icon}
          size="large"
          color={isSelected ? option.color : colors.mat.outlineVariant}
        />
      </IconButton>
      <Text
        style={{
          fontSize: fontSize.sm,
          color: isSelected ? option.color : colors.mat.outlineVariant,
          fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
        }}
      >
        {option.label}
      </Text>
    </View>
  )
}

export default FeedbackPickerOption
