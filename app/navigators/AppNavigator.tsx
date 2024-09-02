import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  RouteProp,
  useRoute,
} from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useColorScheme } from 'react-native'
import Config from '../config'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'
import { colors } from 'app/theme'
import Workout from 'app/screens/Workout'
import ExerciseSelect from 'app/screens/ExerciseSelect'
import ExerciseEdit, {
  ExerciseEditScreenParams,
} from 'app/screens/ExerciseEdit'
import WorkoutFeedback from 'app/screens/WorkoutFeedback'
import Calendar, { CalendarScreenParams } from 'app/screens/Calendar'
import SaveTemplate from 'app/screens/SaveTemplate'
import TemplateSelect from 'app/screens/TemplateSelect'

/**
 * Documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Calendar: CalendarScreenParams
  ExerciseEdit: ExerciseEditScreenParams
  ExerciseSelect: undefined
  Workout: undefined
  WorkoutFeedback: undefined
  SaveTemplate: undefined
  TemplateSelect: undefined
}

export const useRouteParams = <T extends keyof AppStackParamList>(
  screen: T
): AppStackParamList[T] => {
  const route = useRoute<RouteProp<AppStackParamList, T>>()

  return (route.params ?? {}) as AppStackParamList[T]
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  // const {
  //   authenticationStore: { isAuthenticated },
  // } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
      }}
      // initialRouteName={isAuthenticated ? 'Welcome' : 'Login'}
      initialRouteName="Workout"
    >
      {/* {isAuthenticated ? ( */}
      <>
        <Stack.Screen
          name="Calendar"
          component={Calendar}
        />
        <Stack.Screen
          name="ExerciseEdit"
          component={ExerciseEdit}
        />
        <Stack.Screen
          name="ExerciseSelect"
          component={ExerciseSelect}
        />
        <Stack.Screen
          name="Workout"
          component={Workout}
        />
        <Stack.Screen
          name="WorkoutFeedback"
          component={WorkoutFeedback}
        />
        <Stack.Screen
          name="SaveTemplate"
          component={SaveTemplate}
        />
        <Stack.Screen
          name="TemplateSelect"
          component={TemplateSelect}
        />
      </>
      {/* ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Screens.LoginScreen}
          />
        </>
      )} */}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps
) {
  const colorScheme = useColorScheme()

  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
