import styled from 'styled-components/native'

import colors from './colors'

export const IconButtonContainer = styled.TouchableOpacity``

export const ButtonContainer = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  background-color: ${colors.primary};
  display: flex;
  justify-content: center;
`

export const ButtonText = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${colors.primaryText};
`
