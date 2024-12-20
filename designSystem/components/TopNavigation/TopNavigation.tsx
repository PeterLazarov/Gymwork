import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useMemo } from 'react'

import { useAppTheme } from '@/utils/useAppTheme'
import { getActiveRouteName } from 'app/navigators'
import { navThemes } from 'designSystem/theme'

import { TabConfig } from './types'

type Props = {
  tabsConfig: TabConfig[]
  initialRouteName?: string
  screenOptions?: MaterialTopTabNavigationOptions
  tabWidth?: number
  onTabChange?: (name: string) => void
  swipeDisabled?: boolean
  tabHeight?: number
}
const TopTabs: React.FC<Props> = ({
  tabsConfig,
  initialRouteName,
  tabWidth,
  tabHeight = 48,
  onTabChange,
  swipeDisabled,
}) => {
  const Tab = createMaterialTopTabNavigator()
  const {
    theme: { isDark },
  } = useAppTheme()

  const navTheme = useMemo(() => {
    return navThemes[isDark ? 'DarkTheme' : 'LightTheme']
  }, [isDark])

  return (
    <NavigationContainer
      linking={{
        enabled: true,
        prefixes: [
          // TODO
        ],
      }}
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
          tabBarItemStyle: {
            minWidth: tabWidth,
            width: 'auto',
            height: tabHeight,
            // backgroundColor: 'red',
          },
          tabBarStyle: {
            // backgroundColor: 'blue',
          },
          swipeEnabled: !swipeDisabled,
        }}
        // style={{
        //   backgroundColor: 'green',
        // }}
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
