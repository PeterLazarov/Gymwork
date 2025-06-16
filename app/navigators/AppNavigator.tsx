import { PortalHost, PortalProvider } from '@gorhom/portal'
import {
  NavigationContainer,
  NavigationState,
  RouteProp,
  useRoute,
} from '@react-navigation/native'
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { ErrorBoundary } from '@sentry/react-native'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import {
  StatusBar,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native'
import { PaperProvider, Portal } from 'react-native-paper'

import { DialogContextProvider } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import TabsLayout from 'app/layouts/TabsLayout'
import Calendar, { CalendarScreenParams } from 'app/screens/Calendar'
import { ErrorDetails } from 'app/screens/ErrorDetails'
import ExerciseDetails, {
  ExerciseDetailsScreenParams,
} from 'app/screens/ExerciseDetails'
import ExerciseEdit, {
  ExerciseEditScreenParams,
} from 'app/screens/ExerciseEdit'
import ExerciseSelect, {
  ExerciseSelectScreenParams,
} from 'app/screens/ExerciseSelect'
import ReviewScreen from 'app/screens/Review'
import SaveTemplate, {
  SaveTemplateScreenParams,
} from 'app/screens/SaveTemplate'
import Settings from 'app/screens/Settings'
import TemplateSelect from 'app/screens/TemplateSelect'
import UserFeedbackScreen from 'app/screens/UserFeedback'
import Welcome from 'app/screens/Welcome'
import Workout from 'app/screens/Workout'
import WorkoutFeedback from 'app/screens/WorkoutFeedback'
import WorkoutStep from 'app/screens/WorkoutStep'
import { offscreenRef } from 'app/utils/useShareWorkout'
import { navThemes, paperThemes, useColors } from 'designSystem'
import Config from '../config'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'

/**
 * Documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  // Home screens
  Review: undefined
  Workout: undefined
  WorkoutStep: undefined
  WorkoutFeedback: undefined

  // Other screens
  Calendar: CalendarScreenParams
  ExerciseEdit: ExerciseEditScreenParams
  ExerciseSelect: ExerciseSelectScreenParams
  ExerciseDetails: ExerciseDetailsScreenParams
  SaveTemplate: SaveTemplateScreenParams
  TemplateSelect: undefined
  Settings: undefined
  UserFeedback: {
    referrerPage: string
  }
  Welcome: undefined
}

export type RoutesWithParams = {
  [K in keyof AppStackParamList]: AppStackParamList[K] extends undefined
    ? never
    : K
}[keyof AppStackParamList]
export type RoutesWithoutParams = keyof Omit<
  AppStackParamList,
  RoutesWithParams
>

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

export type StackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const { stateStore } = useStores()
  const shouldShowWelcome = !__DEV__ && !stateStore.visitedWelcomeScreen
  const colors = useColors()
  const colorScheme = useColorScheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        navigationBarColor:
          colorScheme === 'light' ? colors.surface : colors.shadow,
      }}
      initialRouteName={shouldShowWelcome ? 'Welcome' : 'Workout'}
    >
      {/* Home screens */}
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
      />
      <Stack.Screen
        name="Workout"
        component={Workout}
      />
      <Stack.Screen
        name="WorkoutStep"
        component={WorkoutStep}
      />
      <Stack.Screen
        name="WorkoutFeedback"
        component={WorkoutFeedback}
      />

      {/* Other screens */}
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
        name="ExerciseDetails"
        component={ExerciseDetails}
        options={{
          presentation: 'modal',
        }}
      />
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
    const { currentRouteName } = props.onStateChange?.(state) ?? {}

    navStore.setProp('activeRoute', currentRouteName)
  }

  const colorScheme = useColorScheme()!
  const colors = useColors()
  const paperTheme = useMemo(() => {
    return paperThemes[colorScheme]
  }, [colorScheme])

  const navTheme = useMemo(() => {
    return navThemes[colorScheme === 'dark' ? 'DarkTheme' : 'LightTheme']
  }, [colorScheme])

  const screenDimensions = useWindowDimensions()

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
        <PortalProvider>
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
                  <TabsLayout>
                    <AppStack />
                  </TabsLayout>
                </>
              </NavigationContainer>
            </DialogContextProvider>
          </Portal.Host>

          <View
            ref={offscreenRef}
            style={{
              position: 'absolute',
              zIndex: 1,
              left: screenDimensions.width,
            }}
          >
            <PortalHost name="offscreen" />
          </View>
        </PortalProvider>
      </ErrorBoundary>
    </PaperProvider>
  )
})
