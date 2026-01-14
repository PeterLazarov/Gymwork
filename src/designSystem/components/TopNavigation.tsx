import React, { FunctionComponent, useMemo } from "react"
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs"

import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { TextStyle, ViewStyle, useColorScheme } from "react-native"
import { navThemes } from "../tokens/theme"
import { getActiveRouteName } from "@/navigators/navigationUtilities"

type Props = {
  tabsConfig: TabConfig[]
  initialRouteName?: string
  screenOptions?: MaterialTopTabNavigationOptions
  tabWidth?: number
  onTabChange?: (name: string) => void
  swipeDisabled?: boolean
  tabHeight?: number
}
export const TopNavigation: React.FC<Props> = ({
  tabsConfig,
  initialRouteName,
  tabWidth,
  tabHeight = 48,
  onTabChange,
  swipeDisabled,
}) => {
  const Tab = createMaterialTopTabNavigator()

  const colorScheme = useColorScheme()!
  const navTheme = useMemo(() => {
    return navThemes[colorScheme === "dark" ? "DarkTheme" : "LightTheme"]
  }, [colorScheme])

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        linking={{
          enabled: true,
          prefixes: [
            // TODO
          ],
        }}
        independent
        theme={navTheme}
        onStateChange={(state) => {
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
              width: "auto",
              height: tabHeight,
              // backgroundColor: 'red',
            },
            tabBarStyle: {
              // backgroundColor: 'blue',
            },
            swipeEnabled: !swipeDisabled,
          }}
          style={{
            flex: 1,
          }}
          backBehavior="none"
        >
          {tabsConfig.map((tab) => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.Component}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

export type TabStyles = {
  headerPanelContainer?: ViewStyle
  header?: {
    label?: TextStyle
    activeLabel?: TextStyle
    activeIndicatorBorder?: ViewStyle
  }
}

export type TabConfig = {
  name: string
  Component: FunctionComponent
}
