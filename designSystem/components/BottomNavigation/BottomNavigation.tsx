import React from 'react'
import { useColorScheme, View, ViewProps } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { boxShadows } from '..'

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
    theme: { colors },
  } = useAppTheme()
  const colorScheme = useColorScheme()

  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View>
          <View
            {...rest}
            style={{
              flexDirection: 'row',
              height: (insets?.bottom ?? 0) * insetCoverage + btnMinHeight,
              backgroundColor:
                colorScheme === 'light' ? colors.surface : colors.shadow,
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
