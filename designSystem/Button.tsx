import styled from 'styled-components/native'

import colors from './colors'

type ButtonProps = {
  primary?: boolean
}

export const IconButtonContainer = styled.TouchableOpacity``

export const ButtonContainer = styled.TouchableOpacity<ButtonProps>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  justify-content: center;
  background: ${props => (props.primary ? colors.primary : colors.secondary)};
`

export const ButtonText = styled.Text<ButtonProps>`
  font-size: 16px;
  text-align: center;
  color: ${props =>
    props.primary ? colors.primaryText : colors.secondaryText};
`
