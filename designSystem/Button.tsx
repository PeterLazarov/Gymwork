import styled from 'styled-components/native'

import colors from './colors'

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'critical' | 'tertiary'
  primary?: boolean
  critical?: boolean
}

export const IconButtonContainer = styled.TouchableOpacity``

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
