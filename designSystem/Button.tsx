import styled from 'styled-components/native'

import { colors } from './tokens'

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'neutral' | 'critical' | 'tertiary'
  type?: 'filled' | 'outline'
  disabled?: boolean
  size?: 'default' | 'small'
}

const buttonVariants = {
  primary: colors.primary,
  secondary: colors.secondary,
  neutral: colors.neutral,
  critical: colors.critical,
  tertiary: colors.tertiary,
}
const buttonSizes = {
  small: '32px',
  default: '48px',
}
export const Button = styled.TouchableOpacity<ButtonProps>`
  justify-content: center;
  align-items: center;
  height: ${({ size }) => buttonSizes[size ?? 'default']};
  gap: 6px;
  flex-direction: row;
  background: ${({ disabled, variant, type }) =>
    disabled
      ? colors.disabled
      : type !== 'outline'
      ? buttonVariants[variant]
      : colors.neutral};
  border-width: ${({ type }) => (type === 'outline' ? '2px' : 0)};
  border-color: ${({ type, variant }) =>
    type === 'outline' ? buttonVariants[variant] : 'transparent'};
`
Button.displayName = 'Button'

const buttonTextVariants = {
  primary: colors.primaryText,
  secondary: colors.secondaryText,
  neutral: colors.neutralText,
  critical: colors.criticalText,
  tertiary: colors.tertiaryText,
}
export const ButtonText = styled.Text<ButtonProps>`
  font-size: 16px;
  text-align: center;
  color: ${({ variant, type }) =>
    type !== 'outline' ? buttonTextVariants[variant] : buttonVariants[variant]};
`
ButtonText.displayName = 'ButtonText'
