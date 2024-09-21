import React, { useMemo } from 'react'
import {
  StyleSheet,
  Platform,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { Text, Icon, IconProps, useColors, fontSize } from '..'

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
  compactMode?: boolean
  style?: StyleProp<ViewStyle>
}
const FeedbackPickerOption: React.FC<Props> = ({
  option,
  onPress,
  isSelected,
  compactMode,
  style,
}) => {
  const colors = useColors()

  const styles = useMemo(
    () => makeStyles(colors, isSelected, compactMode),
    [colors, isSelected, compactMode]
  )

  return (
    <TouchableOpacity
      key={option.value}
      onPress={() => onPress?.(option.value)}
      disabled={!onPress}
      style={[styles.card, style]}
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
            textAlign: 'center',
          }}
        >
          {option.label}
        </Text>
      </>
    </TouchableOpacity>
  )
}

const makeStyles = (
  colors: ReturnType<typeof useColors>,
  isSelected?: boolean,
  compactMode?: boolean
) =>
  StyleSheet.create({
    card: {
      backgroundColor: isSelected
        ? colors.surfaceContainerLowest
        : 'transparent',
      borderRadius: 8,
      paddingVertical: compactMode ? 0 : 16,
      flex: 1,
      alignItems: 'center',
    },
  })

export default FeedbackPickerOption
