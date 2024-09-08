import styled from 'styled-components/native'

import { colors, fontSize } from '../tokens'

type TabLabelProps = {
  isActive: boolean
}

export const TabHeaderTouchable = styled.TouchableOpacity`
  padding-left: 5px;
  padding-right: 5px;
  flex: 1;
  align-items: center;
  justify-content: center;
`
TabHeaderTouchable.displayName = 'TabHeaderTouchable'

export const TabLabel = styled.Text<TabLabelProps>`
  color: ${({ isActive }) => (isActive ? colors.accent : colors.neutralDarker)};
  font-size: ${`${fontSize.md}px`};
`
TabLabel.displayName = 'TabLabel'

export const ActiveIndicator = styled.View`
  margin-left: 10px;
  margin-right: 10px;
  border-bottom-width: 2px;
  border-color: ${colors.accent};
`
ActiveIndicator.displayName = 'ActiveIndicator'
