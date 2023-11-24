import styled from 'styled-components/native'

import colors from '../colors'

type TabLabelProps = {
  isActive: boolean
}

export const TabHeaderTouchable = styled.TouchableOpacity`
  padding-left: 5;
  padding-right: 5;
  flex: 1;
  align-items: 'center';
`

export const TabLabel = styled.Text<TabLabelProps>`
  color: ${({ isActive }) => (isActive ? colors.primary : colors.gray)};
`

export const ActiveIndicator = styled.View`
  margin-left: 10;
  margin-right: 10;
  border-bottom-width: 2;
  border-color: ${colors.primary};
`
