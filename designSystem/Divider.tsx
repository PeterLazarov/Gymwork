import styled from 'styled-components/native'

import { colors } from './tokens'

type Props = {
  orientation: 'horizontal' | 'vertical'
}
export const Divider = styled.View<Props>`
  /* flex: 1; */
  width: ${props => (props.orientation === 'horizontal' ? '100%' : '1px')};
  height: ${props => (props.orientation === 'horizontal' ? '1px' : '100%')};
  background-color: ${colors.primary};
`
