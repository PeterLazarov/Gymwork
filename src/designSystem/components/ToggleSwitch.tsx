import { Switch } from "react-native"
import React from "react"

import { useColors } from "@/designSystem"

interface Props {
  value: boolean
  onValueChange: (value: boolean) => void
  variant: "primary" | "critical"
}
const ToggleSwitch: React.FC<Props> = ({ value, onValueChange, variant }) => {
  const colors = useColors()

  const thumbActiveColor = variant === "critical" ? colors.error : colors.primary

  return (
    <Switch
      trackColor={{
        false: colors.surfaceContainerHighest,
        true: colors.surfaceContainerHigh,
      }}
      thumbColor={value ? thumbActiveColor : colors.surfaceContainer}
      ios_backgroundColor={colors.surfaceContainerHighest}
      onValueChange={onValueChange}
      value={value}
    />
  )
}

export default ToggleSwitch
