import React from 'react'
import { View, ViewProps } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { useAppTheme } from '@/utils/useAppTheme'

import {
  BottomNavigationItem,
  BottomNavigationItemProps,
} from './BottomNavigationItem'

type BottomNavigationProps = {
  activeRoute?: string
  items: BottomNavigationItemProps[]
} & ViewProps

const btnMinHeight = 56
const insetCoverage = 0.75

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeRoute,
  items,
  ...rest
}) => {
  const {
    theme: { colors, boxShadows, isDark },
  } = useAppTheme()

  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View>
          <View
            {...rest}
            style={{
              flexDirection: 'row',
              height: (insets?.bottom ?? 0) * insetCoverage + btnMinHeight,
              backgroundColor: isDark ? colors.shadow : colors.surface,
              ...boxShadows.lg,
            }}
          >
            {items.map(item => (
              <BottomNavigationItem
                key={item.text}
                {...item}
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
