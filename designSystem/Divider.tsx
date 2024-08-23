import styled from 'styled-components/native'

import { colors } from './tokens'

type Props = {
  orientation: 'horizontal' | 'vertical'
  percentSize?: number
}
export const Divider = styled.View<Props>`
  /* flex: 1; */
  width: ${props =>
    props.orientation === 'horizontal'
      ? `${props.percentSize ?? 100}%`
      : '1px'};
  height: ${props =>
    props.orientation === 'horizontal'
      ? '1px'
      : `${props.percentSize ?? 100}%`};
  background-color: ${colors.primary};
`
Divider.displayName = 'Divider'
