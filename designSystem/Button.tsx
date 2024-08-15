import styled from 'styled-components/native'

import colors from './colors'

type IconButtonProps = {
  variant?: 'default' | 'full'
}

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'critical' | 'tertiary'
  disabled?: boolean
}

export const IconButtonContainer = styled.TouchableOpacity<IconButtonProps>`
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  padding: 4px;
  background: ${props =>
    ({
      default: colors.tertiary,
      full: colors.iconBG,
    }[props.variant || 'default'])};
`

const buttonVariants = {
  primary: colors.primary,
  secondary: colors.secondary,
  critical: colors.critical,
  tertiary: colors.tertiary,
}
export const Button = styled.TouchableOpacity<ButtonProps>`
  justify-content: center;
  align-items: center;
  height: 42px;
  gap: 6px;
  flex-direction: row;
  background: ${props =>
    props.disabled ? colors.disabled : buttonVariants[props.variant]};
`

const buttonTextVariants = {
  primary: colors.primaryText,
  secondary: colors.secondaryText,
  critical: colors.criticalText,
  tertiary: colors.tertiaryText,
}
export const ButtonText = styled.Text<ButtonProps>`
  font-size: 16px;
  text-align: center;
  color: ${props => buttonTextVariants[props.variant]};
`
