import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { CompositeScreenProps } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TextStyle, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { translate } from '@/i18n'
import { AppStackScreenProps, AppStackParamList } from '@/navigators'
import * as Screens from '@/screens'
import { useAppTheme } from '@/utils/useAppTheme'
import { ThemedStyle } from 'designSystem/theme'

import { Icon } from '../../designSystem/components/Icon'

export type BottomTabParamList = {
  Review: undefined // TODO indicate top tab?
  WorkoutStack: undefined // TODO date?
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type BottomTabsScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

const Tab = createBottomTabNavigator<BottomTabParamList>()

export function BottomNavigator(): JSX.Element {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      // safeAreaInsets={{ bottom: 12 }}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.onSurface,
        tabBarInactiveTintColor: colors.onSurface,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Review"
        component={Screens.ReviewScreen}
        options={{
          tabBarLabel: translate('review'),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="history"
              color={focused ? colors.onSurface : colors.outlineVariant}
            />
          ),
        }}
      />

      <Tab.Screen
        name="WorkoutStack"
        options={{
          tabBarLabel: translate('workout'),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="dumbbell"
              color={focused ? colors.onSurface : colors.outlineVariant}
            />
          ),
        }}
      >
        {({ route, navigation }) => {
          const WorkoutStack = createNativeStackNavigator()
          return (
            <WorkoutStack.Navigator
              initialRouteName="Workout"
              screenOptions={{
                headerShown: false,
                animation: 'none',
              }}
            >
              <WorkoutStack.Screen
                name="Workout"
                component={Screens.WorkoutScreen}
              />
              <WorkoutStack.Screen
                name="WorkoutStep"
                component={Screens.WorkoutStepScreen}
              />
              <WorkoutStack.Screen
                name="WorkoutFeedback"
                component={Screens.WorkoutFeedbackScreen}
              />
            </WorkoutStack.Navigator>
          )
        }}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: 'transparent',
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: typography.fontSize.xs,
  lineHeight: 16,
  color: colors.onSurface,
})
