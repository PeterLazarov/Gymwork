import React from "react"
import { FAB as FABPaper, FABProps } from "react-native-paper"

import { useColors } from "../tokens/colors"

export const FAB: React.FC<FABProps> = ({ style, disabled, ...otherProps }) => {
  const colors = useColors()

  return (
    <FABPaper
      style={[
        {
          position: "absolute",
          right: "auto",
          left: "auto",
          backgroundColor: disabled ? colors.surfaceDisabled : colors.primary,
        },
        style,
      ]}
      disabled={disabled}
      color={disabled ? colors.onSurfaceDisabled : colors.onPrimary}
      {...otherProps}
    />
  )
}
