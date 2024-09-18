import React from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'

import {
  Text,
  Icon,
  IconButton,
  IconProps,
  useColors,
  fontSize,
  PressableHighlight,
} from '..'

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
  style?: StyleProp<ViewStyle>
}
const FeedbackPickerOption: React.FC<Props> = ({
  option,
  onPress,
  isSelected,
  noPadding,
  style,
}) => {
  const colors = useColors()

  return (
    <PressableHighlight
      key={option.value}
      onPress={() => onPress?.(option.value)}
      style={{
        backgroundColor: isSelected
          ? colors.surfaceContainerLowest
          : 'transparent',
        borderRadius: 8,
        paddingVertical: 16,
        flex: 1,
        alignItems: 'center',
      }}
    >
      <>
        <Icon
          icon={option.icon}
          size="large"
          color={isSelected ? option.color : colors.outlineVariant}
        />
        <Text
          style={{
            fontSize: fontSize.sm,
            color: isSelected ? option.color : colors.outlineVariant,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          {option.label}
        </Text>
      </>
    </PressableHighlight>
  )
}

export default FeedbackPickerOption
