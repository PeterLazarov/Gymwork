import styled from 'styled-components/native'

import colors from './colors'

type IconButtonProps = {
  variant?: 'default' | 'full'
}

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'critical' | 'tertiary'
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
    })[props.variant || 'default']};
`

export const ButtonContainer = styled.TouchableOpacity<ButtonProps>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  justify-content: center;
  background: ${props =>
    ({
      primary: colors.primary,
      secondary: colors.secondary,
      critical: colors.critical,
      tertiary: colors.tertiary,
    })[props.variant]};
`

export const ButtonText = styled.Text<ButtonProps>`
  font-size: 16px;
  text-align: center;
  color: ${props =>
    ({
      primary: colors.primaryText,
      secondary: colors.secondaryText,
      critical: colors.criticalText,
      tertiary: colors.tertiaryText,
    })[props.variant]};
`
