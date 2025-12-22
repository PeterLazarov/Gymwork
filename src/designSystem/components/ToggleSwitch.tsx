import { Switch } from "react-native"
import React from "react"

import { useColors } from "../tokens/colors"

interface Props {
  value: boolean
  onValueChange: (value: boolean) => void
  variant: "primary" | "critical"
  disabled?: boolean
}
export const ToggleSwitch: React.FC<Props> = ({ value, variant, ...rest }) => {
  const colors = useColors()

  const thumbActiveColor = variant === "critical" ? colors.error : colors.primary

  return (
    <Switch
      trackColor={{
        false: colors.surfaceContainerHighest,
        true: colors.surfaceContainerHigh,
      }}
      thumbColor={value ? thumbActiveColor : colors.surfaceContainerHigh}
      ios_backgroundColor={colors.surfaceContainerHighest}
      value={value}
      {...rest}
    />
  )
}
