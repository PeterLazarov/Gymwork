import React, { useMemo } from 'react'
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { fontSize, spacing } from 'designSystem/theme'

import { Icon, IconProps, Text } from '..'

export type FeedbackOption = {
  icon: IconProps['icon']
  label: string
  color: string
  value: string
}
export type FeedbackPickerOptionProps = {
  isSelected?: boolean
  onPress?: (feeling: string) => void
  option: FeedbackOption
  compactMode?: boolean
  style?: StyleProp<ViewStyle>
}
const FeedbackPickerOption: React.FC<FeedbackPickerOptionProps> = ({
  option,
  onPress,
  isSelected,
  compactMode,
  style,
}) => {
  const {
    theme: { colors },
  } = useAppTheme()

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
  colors: ReturnType<typeof useAppTheme>['theme']['colors'],
  isSelected?: boolean,
  compactMode?: boolean
) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: isSelected
        ? colors.surfaceContainerLowest
        : 'transparent',
      borderRadius: 8,
      flex: 1,
      gap: spacing.xxs,
      paddingVertical: compactMode ? 0 : spacing.md,
    },
  })

export default FeedbackPickerOption
