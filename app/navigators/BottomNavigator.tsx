import {
  createNativeBottomTabNavigator,
  NativeBottomTabScreenProps,
} from '@bottom-tabs/react-navigation'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ImageURISource, Platform } from 'react-native'
import { AppleIcon } from 'react-native-bottom-tabs'

import WorkoutHeaderRight from '@/components/Workout/WorkoutHeaderRight'
import { translate } from '@/i18n'
import { AppStackScreenProps, AppStackParamList } from '@/navigators'
import * as Screens from '@/screens'
import { useAppTheme } from '@/utils/useAppTheme'

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
    // BottomTabScreenProps<BottomTabParamList, T>,
    NativeBottomTabScreenProps<BottomTabParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

// const Tab = createBottomTabNavigator<BottomTabParamList>()
// TODO remove type-hack BS
const Tab: ReturnType<typeof createBottomTabNavigator<BottomTabParamList>> =
  createNativeBottomTabNavigator<BottomTabParamList>()

// on iOS, the tabs float over the content. This is added as padding to compensate
export const TabHeightCompensation =
  Platform.select({
    ios: 83,
    android: 0, // TODO determine if thats really it
  }) ?? 0

export function BottomNavigator(): JSX.Element {
  const {
    // themed,
    theme: { colors, isDark },
  } = useAppTheme()

  return (
    <Tab.Navigator
      key={String(isDark)} // rerender due to bug https://github.com/callstackincubator/react-native-bottom-tabs/issues/227
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.onSurface,
        tabBarInactiveTintColor: colors.onSurface,
      }}
    >
      <Tab.Screen
        name="Review"
        component={Screens.ReviewScreen}
        options={{
          tabBarLabel: translate('review'),
          tabBarIcon: ({ focused }) =>
            MaterialIcons.getImageSourceSync('history', 24, 'black')!,
        }}
      />

      <Tab.Screen
        name="WorkoutStack"
        options={{
          tabBarLabel: translate('workout'),
          tabBarIcon: ({ focused }): ImageURISource | AppleIcon =>
            MaterialIcons.getImageSourceSync('fitness-center', 24, 'black')!,
        }}
      >
        {({ route, navigation }) => {
          const WorkoutStack = createNativeStackNavigator()
          return (
            <WorkoutStack.Navigator
              initialRouteName="Workout"
              screenOptions={
                {
                  // headerShown: false,
                  // animation: 'none',
                }
              }
            >
              <WorkoutStack.Screen
                name="Workout"
                component={Screens.WorkoutScreen}
                options={{
                  headerRight(props) {
                    return (
                      // <View
                      //   style={{ height: 40, width: 40, backgroundColor: 'blue' }}
                      // ></View>
                      <WorkoutHeaderRight />
                    )
                  },
                  // headerTitle(props) {
                  //   console.log(props.c)
                  //   return 'lalala'
                  // },
                }}
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
