import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { TabConfig, TabStyles } from './types'
import colors from '../colors'

type Props = {
  index: number
  item: TabConfig
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
  const inactiveColor = style?.labelColor || colors.gray
  const activeColor = style?.activeLabelColor || colors.primary
  const color = isActive ? activeColor : inactiveColor

  return (
    <View style={{ flex: 1, height: 30 }}>
      <TouchableOpacity
        onPress={() => onHeaderPress(index)}
        style={[
          {
            paddingHorizontal: 5,
            flexGrow: 1,
            flex: 1,
            alignItems: 'center',
          },
          style?.button,
        ]}
      >
        <Text style={{ color }}>{item.label}</Text>
      </TouchableOpacity>
      {isActive && (
        <View
          style={[
            {
              marginHorizontal: 10,
              borderBottomWidth: 2,
              borderColor: style?.activeIndicatorBorderColor || colors.primary,
            },
          ]}
        />
      )}
    </View>
  )
}

export default TabHeader
