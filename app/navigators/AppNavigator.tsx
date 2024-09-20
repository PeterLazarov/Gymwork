import {
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
import React, { useMemo } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { Portal, PaperProvider } from 'react-native-paper'
import { ErrorBoundary } from '@sentry/react-native'

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
import { navThemes, paperThemes, useColors } from 'designSystem'
import { DialogContextProvider } from 'app/contexts/DialogContext'
import { ErrorDetails } from 'app/screens/ErrorDetails'
import UserFeedbackScreen from 'app/screens/UserFeedback'
import Welcome from 'app/screens/Welcome'

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
  UserFeedback: undefined
  Welcome: undefined
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
  const colorScheme = useColorScheme()
  const { stateStore } = useStores()

  const shouldShowWelcome = !__DEV__ && !stateStore.visitedWelcomeScreen

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor:
          colorScheme === 'light' ? colors.surface : colors.shadow,
        animation: 'none',
      }}
      initialRouteName={shouldShowWelcome ? 'Welcome' : 'HomeStack'}
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
        <Stack.Screen
          name="UserFeedback"
          component={UserFeedbackScreen}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
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
  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  const { navStore } = useStores()
  function handleStateChange(state: NavigationState | undefined) {
    // @ts-ignore
    const { currentRouteName, previousRouteName } =
      props.onStateChange?.(state) ?? {}

    navStore.setProp('activeRoute', currentRouteName)
  }

  const colorScheme = useColorScheme()! // TODO is it really nullable?
  const colors = useColors()
  const paperTheme = useMemo(() => {
    return paperThemes[colorScheme]
  }, [colorScheme])

  const navTheme = useMemo(() => {
    return navThemes[colorScheme === 'dark' ? 'DarkTheme' : 'LightTheme']
  }, [colorScheme])

  return (
    <PaperProvider theme={paperTheme}>
      <ErrorBoundary
        fallback={({ error, resetError }) => (
          <ErrorDetails
            error={error}
            resetError={resetError}
          />
        )}
      >
        <Portal.Host>
          <DialogContextProvider>
            <NavigationContainer
              theme={navTheme}
              ref={navigationRef}
              {...props}
              onStateChange={handleStateChange}
            >
              <>
                <StatusBar
                  backgroundColor={
                    colorScheme === 'light' ? colors.primary : colors.shadow
                  }
                  barStyle={'light-content'}
                />
                <AppStack />
              </>
            </NavigationContainer>
          </DialogContextProvider>
        </Portal.Host>
      </ErrorBoundary>
    </PaperProvider>
  )
})
