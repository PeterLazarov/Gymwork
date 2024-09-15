import styled from 'styled-components/native'

import { lightColors } from './tokens'

type ButtonProps = {
  variant: 'primary' | 'accent' | 'neutral' | 'critical' | 'tertiary'
  type?: 'filled' | 'outline'
  disabled?: boolean
  size?: 'default' | 'small'
}

const buttonVariants = {
  primary: lightColors.primary,
  accent: lightColors.accent,
  neutral: lightColors.neutral,
  critical: lightColors.critical,
  tertiary: lightColors.tertiary,
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
      ? lightColors.disabled
      : type !== 'outline'
      ? buttonVariants[variant]
      : lightColors.neutralLight};
  border-width: ${({ type }) => (type === 'outline' ? '2px' : 0)};
  border-color: ${({ type, variant }) =>
    type === 'outline' ? buttonVariants[variant] : 'transparent'};
`
Button.displayName = 'Button'

const buttonTextVariants = {
  primary: lightColors.primaryText,
  accent: lightColors.secondaryText,
  neutral: lightColors.neutralText,
  critical: lightColors.criticalText,
  tertiary: lightColors.tertiaryText,
}
export const ButtonText = styled.Text<ButtonProps>`
  font-size: 16px;
  text-align: center;
  color: ${({ variant, type }) =>
    type !== 'outline' ? buttonTextVariants[variant] : buttonVariants[variant]};
`
ButtonText.displayName = 'ButtonText'
