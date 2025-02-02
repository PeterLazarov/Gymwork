import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'

import { getActiveRouteName } from 'app/navigators'

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

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName || tabsConfig[0]?.name}
      screenListeners={{
        state(e) {
          const state = e.data.state
          const route = getActiveRouteName(state!)
          onTabChange?.(route)
        },
      }}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: {
          minWidth: tabWidth,
          width: 'auto',
          height: tabHeight,
        },
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
  )
}

export default TopTabs
