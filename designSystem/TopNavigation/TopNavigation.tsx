import React, { useMemo } from 'react'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'

import { TabConfig } from './types'
import { NavigationContainer } from '@react-navigation/native'
import { getActiveRouteName } from 'app/navigators'
import { navThemes } from 'designSystem/tokens'
import { useColorScheme } from 'react-native'

type Props = {
  tabsConfig: TabConfig[]
  initialRouteName?: string
  screenOptions?: MaterialTopTabNavigationOptions
  tabWidth?: number
  onTabChange?: (name: string) => void
  swipeDisabled?: boolean
}
const TopTabs: React.FC<Props> = ({
  tabsConfig,
  initialRouteName,
  tabWidth,
  onTabChange,
  swipeDisabled,
}) => {
  const Tab = createMaterialTopTabNavigator()

  const colorScheme = useColorScheme()!
  const navTheme = useMemo(() => {
    return navThemes[colorScheme === 'dark' ? 'DarkTheme' : 'LightTheme']
  }, [colorScheme])
  console.log('asd', initialRouteName || tabsConfig[0]?.name)
  return (
    <NavigationContainer
      independent
      theme={navTheme}
      onStateChange={state => {
        if (state) {
          const route = getActiveRouteName(state!)
          onTabChange?.(route)
        }
      }}
    >
      <Tab.Navigator
        initialRouteName={initialRouteName || tabsConfig[0]?.name}
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: tabWidth },
          swipeEnabled: !swipeDisabled,
        }}
        backBehavior="none"
      >
        {tabsConfig.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.Component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default TopTabs
