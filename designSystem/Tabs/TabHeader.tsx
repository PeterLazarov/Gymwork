import React from 'react'
import { View } from 'react-native'

import { ActiveIndicator, TabHeaderTouchable, TabLabel } from './styled'
import { TabConfig, TabStyles } from './types'

type Props = {
  index: number
  item: TabConfig
  style?: TabStyles['header']
  currentIndex: number
  scrollableContainer?: boolean
  onHeaderPress: (index: number) => void
  size: 'md' | 'lg'
}
const TabHeader: React.FC<Props> = ({
  index,
  item,
  style,
  currentIndex,
  onHeaderPress,
  size,
}) => {
  const isActive = index === currentIndex

  const sizes = {
    md: 40,
    lg: 52,
  }

  return (
    <View style={{ flex: 1, height: sizes[size] }}>
      <TabHeaderTouchable onPress={() => onHeaderPress(index)}>
        <TabLabel
          isActive={isActive}
          style={isActive ? style?.activeLabel : style?.label}
          // size={size}
        >
          {item.label}
        </TabLabel>
      </TabHeaderTouchable>
      {isActive && <ActiveIndicator style={style?.activeIndicatorBorder} />}
    </View>
  )
}

export default TabHeader
