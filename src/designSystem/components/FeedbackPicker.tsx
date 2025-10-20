import React, { useMemo, useState } from "react"
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { Icon, IconProps, Text, fontSize, spacing, useColors } from "@/designSystem"

interface SubComponents {
  Option: React.FC<PickerOptionProps>
}

type PickerProps = {
  selected?: string
  onChange: (feeling?: string) => void
  options: FeedbackOption[]
  defaultValue?: string
}
export const FeedbackPicker: React.FC<PickerProps> & SubComponents = ({
  selected,
  onChange,
  options,
  defaultValue,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(selected || defaultValue)

  function onPress(option: string) {
    const newValue = selected === option ? undefined : option
    setSelectedIcon(newValue)
    onChange(newValue)
  }

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        gap: spacing.md,
      }}
    >
      {options.map((option) => (
        <PickerOption
          key={option.value}
          option={option}
          isSelected={selectedIcon === option.value}
          onPress={onPress}
        />
      ))}
    </View>
  )
}

export default FeedbackPicker

export type FeedbackOption = {
  icon: IconProps["icon"]
  label: string
  color: string
  value: string
}
type PickerOptionProps = {
  isSelected?: boolean
  onPress?: (feeling: string) => void
  option: FeedbackOption
  compactMode?: boolean
  style?: StyleProp<ViewStyle>
}
const PickerOption: React.FC<PickerOptionProps> = ({
  option,
  onPress,
  isSelected,
  compactMode,
  style,
}) => {
  const colors = useColors()

  const styles = useMemo(
    () => makeStyles(colors, isSelected, compactMode),
    [colors, isSelected, compactMode],
  )

  return (
    <Pressable
      key={option.value}
      onPress={() => onPress?.(option.value)}
      disabled={!onPress}
      style={[styles.card, style]}
    >
      <Icon
        icon={option.icon}
        size="large"
        color={isSelected ? option.color : colors.outlineVariant}
      />
      <Text
        style={{
          fontSize: fontSize.sm,
          color: isSelected ? option.color : colors.outlineVariant,
          fontWeight: Platform.OS === "ios" ? 700 : "bold",
          textAlign: "center",
        }}
        text={option.label}
      />
    </Pressable>
  )
}

const makeStyles = (
  colors: ReturnType<typeof useColors>,
  isSelected?: boolean,
  compactMode?: boolean,
) =>
  StyleSheet.create({
    card: {
      backgroundColor: isSelected ? colors.surfaceContainerLowest : "transparent",
      borderRadius: 8,
      gap: spacing.xxs,
      paddingVertical: compactMode ? 0 : spacing.md,
      flex: 1,
      alignItems: "center",
    },
  })

FeedbackPicker.Option = PickerOption
