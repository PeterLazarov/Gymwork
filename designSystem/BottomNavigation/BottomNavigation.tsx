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

const btnMinHeight = 56
const insetCoverage = 0.75

export const BottomNavigation: React.FC<Props> = ({ activeRoute, items }) => {
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View>
          <View
            style={{
              flexDirection: 'row',
              height: (insets?.bottom ?? 0) * insetCoverage + btnMinHeight,
              backgroundColor: colors.neutralLightest,
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

          {/* Inset Coverage Hack */}
          <View
            style={{
              height: (insets?.bottom ?? 0) * insetCoverage,
              width: '100%',
              position: 'absolute',
              bottom: 0,
            }}
          ></View>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  )
}
