import React from 'react'
import { View } from 'react-native'

import { boxShadows, colors } from '../'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { BottomNavigationItem } from './BottomNavigationItem'
import { Item } from './types'

type Props = {
  activeRoute?: string
  items: Item[]
}
export const BottomNavigation: React.FC<Props> = ({ activeRoute, items }) => {
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: colors.neutralLightest,
            paddingBottom: insets && insets.bottom > 0 ? insets.bottom - 10 : 0,
            ...boxShadows.lg,
          }}
        >
          {items.map(item => (
            <BottomNavigationItem
              key={item.text}
              item={item}
              isSelected={item.routes.includes(activeRoute)}
            />
          ))}
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  )
}
