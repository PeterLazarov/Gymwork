import { TouchableOpacityProps } from 'react-native-gesture-handler'

import { Text, useColors } from '.'
import { TextProps } from 'react-native'
import PressableHighlight from './PressableHighlight'

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
    accent: colors.accent,
    neutral: colors.neutral,
    critical: colors.critical,
    tertiary: colors.tertiary,
    disabled: colors.disabled,
    outline: colors.neutralLight,
  }

  const color = disabled ? 'disabled' : type === 'outline' ? 'outline' : variant

  return (
    <PressableHighlight
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
    accent: colors.accent,
    neutral: colors.neutral,
    critical: colors.critical,
    tertiary: colors.tertiary,
  }

  const buttonTextColors = {
    primary: colors.primaryText,
    accent: colors.accentText,
    neutral: colors.neutralText,
    critical: colors.criticalText,
    tertiary: colors.tertiaryText,
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
