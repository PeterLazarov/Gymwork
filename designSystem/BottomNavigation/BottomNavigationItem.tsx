import React from 'react'
import { View, Text } from 'react-native'

import { Icon, PressableHighlight, colors, fontSize } from '../'
import { Item } from './types'

type Props = {
  item: Item
  isSelected: boolean
}
export const BottomNavigationItem: React.FC<Props> = ({ item, isSelected }) => (
  <PressableHighlight
    key={item.text}
    onPress={item.onPress}
    style={{
      flex: 1,
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <Icon
        icon={item.icon}
        color={isSelected ? colors.primary : colors.neutralDarkest}
      />
      <Text
        style={{
          color: isSelected ? colors.primary : colors.neutralDarkest,
          fontSize: fontSize.sm,
        }}
      >
        {item.text}
      </Text>
    </View>
  </PressableHighlight>
)
