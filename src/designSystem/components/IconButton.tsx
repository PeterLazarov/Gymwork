import React from "react"
import { Pressable, PressableProps, ViewStyle } from "react-native"

const sizes = {
  sm: 24,
  md: 42,
  lg: 68,
}
type Props = Omit<PressableProps, "style"> & {
  style?: ViewStyle
  size?: keyof typeof sizes
  underlay?: "default" | "darker"
}
export const IconButton: React.FC<Props> = ({
  style,
  size = "md",
  underlay = "default",
  ...props
}) => (
  <Pressable
    style={{
      flexGrow: 0,
      height: sizes[size],
      width: sizes[size],
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
    underlay={underlay}
    {...props}
  />
)
