import React from 'react'
import { View } from 'react-native'

import { ActiveIndicator, TabHeaderTouchable, TabLabel } from './components'
import { TabConfig, TabStyles } from './types'

type Props = {
  index: number
  item: TabConfig<any>
  style?: TabStyles['header']
  currentIndex: number
  scrollableContainer?: boolean
  onHeaderPress: (index: number) => void
}
const TabHeader: React.FC<Props> = ({
  index,
  item,
  style,
  currentIndex,
  onHeaderPress,
}) => {
  const isActive = index === currentIndex

  return (
    <View style={{ flex: 1, height: 52 }}>
      <TabHeaderTouchable onPress={() => onHeaderPress(index)}>
        <TabLabel
          isActive={isActive}
          style={isActive ? style?.activeLabel : style?.label}
        >
          {item.label}
        </TabLabel>
      </TabHeaderTouchable>
      {isActive && <ActiveIndicator style={style?.activeIndicatorBorder} />}
    </View>
  )
}

export default TabHeader
