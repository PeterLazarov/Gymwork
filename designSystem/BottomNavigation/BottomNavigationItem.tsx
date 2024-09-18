import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Text, Icon, useColors, fontSize } from '../'
import { Item } from './types'

type Props = {
  item: Item
  isSelected: boolean
}
export const BottomNavigationItem: React.FC<Props> = ({ item, isSelected }) => {
  const colors = useColors()

  return (
    <TouchableOpacity
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
          color={isSelected ? colors.primary : colors.onSurfaceVariant}
        />
        <Text
          style={{
            color: isSelected ? colors.primary : colors.onSurfaceVariant,
            fontSize: fontSize.sm,
          }}
        >
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
