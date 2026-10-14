import { ReactNode } from "react"
import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from "react-native"

import { useColors } from "../tokens/colors"
import { Text } from "./Text"

const buttonSizes = {
  xSmall: 24,
  small: 32,
  default: 48,
}
type ButtonVariants = {
  variant: "primary" | "accent" | "neutral" | "critical" | "tertiary" | "secondary"
  type?: "filled" | "outline"
}
export type ButtonProps = Omit<PressableProps, "style"> &
  ButtonVariants & {
    size?: keyof typeof buttonSizes
    children?: ReactNode | string
    text?: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
  }

export const Button: React.FC<ButtonProps> = ({
  size = "default",
  disabled,
  variant,
  type,
  style,
  text,
  children,
  textStyle,
  ...otherProps
}) => {
  const colors = useColors()

  const buttonColors = {
    primary: colors.primary,
    accent: colors.tertiaryContainer,
    neutral: colors.secondaryContainer,
    critical: colors.error,
    tertiary: colors.surfaceContainer,
    secondary: colors.outlineVariant,
    outline: colors.outline,
  } as const

  const buttonTextColors = {
    primary: colors.onPrimary,
    accent: colors.onTertiaryContainer,
    neutral: colors.onSecondaryContainer,
    secondary: colors.onSecondaryContainer,
    critical: colors.onError,
    tertiary: colors.onSurface,
  } as const

  const isOutline = type === "outline"
  const buttonStyle = isOutline
    ? {
        backgroundColor: "transparent",
        borderColor: disabled ? colors.surfaceDisabled : buttonColors[variant],
        textColor: disabled ? colors.onSurfaceDisabled : buttonColors[variant],
      }
    : {
        backgroundColor: disabled ? colors.surfaceDisabled : buttonColors[variant],
        borderColor: "transparent",
        textColor: disabled ? colors.onSurfaceDisabled : buttonTextColors[variant],
      }

  return (
    <Pressable
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          height: buttonSizes[size],
          gap: 6,
          flexDirection: "row",
          backgroundColor: buttonStyle.backgroundColor,
          borderWidth: type === "outline" ? 2 : 0,
          borderColor: buttonStyle.borderColor,
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
            color: buttonStyle.textColor,
          },
          textStyle,
        ]}
        text={text}
      ></Text>
      {children}
    </Pressable>
  )
}
