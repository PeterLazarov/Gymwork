import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationState,
  RouteProp,
  useRoute,
} from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import Config from '../config'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'
import Workout from 'app/screens/Workout'
import ExerciseSelect, {
  ExerciseSelectScreenParams,
} from 'app/screens/ExerciseSelect'
import ExerciseEdit, {
  ExerciseEditScreenParams,
} from 'app/screens/ExerciseEdit'
import WorkoutFeedback from 'app/screens/WorkoutFeedback'
import Calendar, { CalendarScreenParams } from 'app/screens/Calendar'
import SaveTemplate, {
  SaveTemplateScreenParams,
} from 'app/screens/SaveTemplate'
import TemplateSelect from 'app/screens/TemplateSelect'
import WorkoutStep from 'app/screens/WorkoutStep'
import ReviewScreen from 'app/screens/Review'
import TabsLayout from 'app/layouts/TabsLayout'
import { useStores } from 'app/db/helpers/useStores'
import Settings from 'app/screens/Settings'
import { useColors } from 'designSystem'

/**
 * Documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Calendar: CalendarScreenParams
  ExerciseEdit: ExerciseEditScreenParams
  ExerciseSelect: ExerciseSelectScreenParams
  SaveTemplate: SaveTemplateScreenParams
  TemplateSelect: undefined
  HomeStack: undefined
  Settings: undefined
}

export type HomeStackParamList = {
  Review: undefined
  WorkoutStack: undefined
}

export type WorkoutStackParamList = {
  Workout: undefined
  WorkoutStep: undefined
  WorkoutFeedback: undefined
}

export type AllStacksParamList = AppStackParamList &
  HomeStackParamList &
  WorkoutStackParamList

export const useRouteParams = <T extends keyof AllStacksParamList>(
  screen: T
): AllStacksParamList[T] => {
  const route = useRoute<RouteProp<AllStacksParamList, T>>()

  return (route.params ?? {}) as AllStacksParamList[T]
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type StackScreenProps<T extends keyof AllStacksParamList> =
  NativeStackScreenProps<AllStacksParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const colors = useColors()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.neutralLightest,
        animation: 'none',
      }}
      initialRouteName="HomeStack"
    >
      <>
        <Stack.Screen
          name="Calendar"
          component={Calendar}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
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
          name="HomeStack"
          options={{ animation: 'none' }}
        >
          {({ route, navigation }) => {
            const HomeStack = createNativeStackNavigator()

            return (
              <TabsLayout>
                <HomeStack.Navigator
                  initialRouteName="WorkoutStack"
                  screenOptions={{
                    headerShown: false,
                    animation: 'none',
                  }}
                >
                  <HomeStack.Screen
                    name="Review"
                    component={ReviewScreen}
                  />

                  <HomeStack.Screen
                    name="WorkoutStack"
                    options={{ animation: 'none' }}
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
                            component={Workout}
                          />
                          <WorkoutStack.Screen
                            name="WorkoutStep"
                            component={WorkoutStep}
                          />
                          <WorkoutStack.Screen
                            name="WorkoutFeedback"
                            component={WorkoutFeedback}
                          />
                        </WorkoutStack.Navigator>
                      )
                    }}
                  </HomeStack.Screen>
                </HomeStack.Navigator>
              </TabsLayout>
            )
          }}
        </Stack.Screen>

        <Stack.Screen
          name="SaveTemplate"
          component={SaveTemplate}
        />
        <Stack.Screen
          name="TemplateSelect"
          component={TemplateSelect}
        />
      </>
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps
) {
  const colorScheme = useColorScheme()
  const colors = useColors()

  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  const { stateStore } = useStores()
  function handleStateChange(state: NavigationState | undefined) {
    // @ts-ignore
    const { currentRouteName, previousRouteName } =
      props.onStateChange?.(state) ?? {}

    stateStore.setProp('activeRoute', currentRouteName)
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}
      onStateChange={handleStateChange}
    >
      <>
        <StatusBar
          backgroundColor={colorScheme === 'light' ? colors.primary : 'black'}
          barStyle={'light-content'}
        ></StatusBar>
        <AppStack />
      </>
    </NavigationContainer>
  )
})
