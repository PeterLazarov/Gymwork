import { TouchableOpacityProps } from 'react-native-gesture-handler'

import { Text, useColors } from '.'
import { TextProps, TouchableOpacity } from 'react-native'

type ButtonVariants = {
  variant: 'primary' | 'accent' | 'neutral' | 'critical' | 'tertiary'
  type?: 'filled' | 'outline'
}
type ButtonProps = TouchableOpacityProps &
  ButtonVariants & {
    size?: 'default' | 'small'
  }

const buttonSizes = {
  small: 32,
  default: 48,
}
export const Button: React.FC<ButtonProps> = ({
  size = 'default',
  disabled,
  variant,
  type,
  style,
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

  const color = disabled ? 'disabled' : type === 'outline' ? 'outline' : variant

  return (
    <TouchableOpacity
      activeOpacity={0.4}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          height: buttonSizes[size],
          gap: 6,
          flexDirection: 'row',
          backgroundColor: buttonColors[color],
          borderWidth: type === 'outline' ? 2 : 0,
          borderColor:
            type === 'outline' ? buttonColors[variant] : 'transparent',
        },
        style,
      ]}
      disabled={disabled}
      {...otherProps}
    />
  )
}

type ButtonTextProps = TextProps & ButtonVariants
export const ButtonText: React.FC<ButtonTextProps> = ({
  variant,
  type,
  style,
  ...otherProps
}) => {
  const colors = useColors()

  const buttonColors = {
    primary: colors.primary,
    accent: colors.tertiaryContainer,
    neutral: colors.secondaryContainer,
    critical: colors.error,
    tertiary: colors.surfaceContainer,
  }

  const buttonTextColors = {
    primary: colors.onPrimary,
    accent: colors.onTertiaryContainer,
    neutral: colors.onSecondaryContainer,
    critical: colors.onError,
    tertiary: colors.onSurface,
  }

  return (
    <Text
      style={[
        {
          textAlign: 'center',
          color:
            type !== 'outline'
              ? buttonTextColors[variant]
              : buttonColors[variant],
        },
        style,
      ]}
      {...otherProps}
    />
  )
}
