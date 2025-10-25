import { ReactNode } from "react"
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native"

import { useColors } from "../tokens/colors"
import { Text } from "./Text"

type ButtonVariants = {
  variant: "primary" | "accent" | "neutral" | "critical" | "tertiary"
  type?: "filled" | "outline"
}
type ButtonProps = Omit<PressableProps, "style"> &
  ButtonVariants & {
    size?: "default" | "small"
    children?: ReactNode | string
    text?: string
    style?: StyleProp<ViewStyle>
  }

const buttonSizes = {
  small: 32,
  default: 48,
}
export const Button: React.FC<ButtonProps> = ({
  size = "default",
  disabled,
  variant,
  type,
  style,
  text,
  children,
  ...otherProps
}) => {
  const colors = useColors()

  const buttonColors = {
    primary: colors.primary,
    accent: colors.tertiaryContainer,
    neutral: colors.secondaryContainer,
    critical: colors.error,
    tertiary: colors.surfaceContainer,
    disabled: colors.outlineVariant,
    outline: colors.outline,
  }

  const buttonTextColors = {
    primary: colors.onPrimary,
    accent: colors.onTertiaryContainer,
    neutral: colors.onSecondaryContainer,
    critical: colors.onError,
    tertiary: colors.onSurface,
  }

  const color = disabled ? "disabled" : type === "outline" ? "outline" : variant

  return (
    <Pressable
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          height: buttonSizes[size],
          gap: 6,
          flexDirection: "row",
          backgroundColor: buttonColors[color],
          borderWidth: type === "outline" ? 2 : 0,
          borderColor: type === "outline" ? buttonColors[variant] : "transparent",
        },
        style,
      ]}
      disabled={disabled}
      {...otherProps}
    >
      <Text
        style={[
          {
            textAlign: "center",
            color: type !== "outline" ? buttonTextColors[variant] : buttonColors[variant],
          },
        ]}
        text={text}
      >
        {children}
      </Text>
    </Pressable>
  )
}
