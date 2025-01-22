/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { PortalHost, PortalProvider } from '@gorhom/portal'
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
import { ErrorBoundary } from '@sentry/react-native'
import { observer } from 'mobx-react-lite'
import { ComponentProps, useMemo } from 'react'
import {
  // StatusBar,
  useWindowDimensions,
  View,
} from 'react-native'
import { PaperProvider, Portal } from 'react-native-paper'

import { DialogContextProvider } from '@/contexts/DialogContext'
import { useStores } from '@/db/helpers/useStores'
import * as Screens from '@/screens'
import { useAppTheme, useThemeProvider } from '@/utils/useAppTheme'
import { offscreenRef } from 'app/utils/useShareWorkout'
import { navThemes, paperThemes } from 'designSystem/theme'

import Config from '../config'

import { BottomNavigator } from './BottomNavigator'
import { navigationRef, useBackButtonHandler } from './navigationUtilities'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Calendar: Screens.CalendarScreenParams
  ExerciseEdit: Screens.ExerciseEditScreenParams
  ExerciseSelect: Screens.ExerciseSelectScreenParams
  SaveTemplate: Screens.SaveTemplateScreenParams
  TemplateSelect: undefined
  HomeStack: undefined
  Settings: undefined
  UserFeedback: {
    referrerPage: string
  }

  Welcome: undefined
  // 🔥 Your screens go here
  ExerciseDetails: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
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

export type RoutesWithParams = {
  [K in keyof AllStacksParamList]: AllStacksParamList[K] extends undefined
    ? never
    : K
}[keyof AllStacksParamList]
export type RoutesWithoutParams = keyof Omit<
  AllStacksParamList,
  RoutesWithParams
>

// TODO? move to navigation utilities?
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

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const { stateStore } = useStores()

  const shouldShowWelcome = !__DEV__ && !stateStore.visitedWelcomeScreen

  const {
    theme: { colors, isDark },
  } = useAppTheme()

  // TODO native header?
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        // navigationBarColor: colors.background,
        navigationBarColor: isDark ? colors.shadow : colors.surface,
        contentStyle: {
          backgroundColor: isDark ? colors.shadow : colors.surface,
        },
      }}
      initialRouteName={shouldShowWelcome ? 'Welcome' : 'HomeStack'}
    >
      <Stack.Screen
        name="Calendar"
        component={Screens.CalendarScreen}
      />
      <Stack.Screen
        name="Settings"
        component={Screens.SettingsScreen}
      />
      <Stack.Screen
        name="ExerciseEdit"
        component={Screens.ExerciseEditScreen}
      />
      <Stack.Screen
        name="ExerciseSelect"
        component={Screens.ExerciseSelectScreen}
      />
      <Stack.Screen
        name="HomeStack"
        component={BottomNavigator}
      />

      <Stack.Screen
        name="SaveTemplate"
        component={Screens.SaveTemplateScreen}
      />
      <Stack.Screen
        name="TemplateSelect"
        component={Screens.TemplateSelectScreen}
      />
      <Stack.Screen
        name="UserFeedback"
        component={Screens.UserFeedbackScreen}
      />
      <Stack.Screen
        name="Welcome"
        component={Screens.WelcomeScreen}
      />

      <Stack.Screen
        name="ExerciseDetails"
        component={Screens.ExerciseDetailsScreen}
        options={{ presentation: 'modal', headerShown: true }}
      />

      {/* ! ADD YOUR SCREENS TO NavStore pages */}
      {/** 🔥 Your screens go here */}
      {/* ! ADD YOUR SCREENS TO NavStore pages */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps
) {
  const {
    themeScheme,
    navigationTheme,
    setThemeContextOverride,
    ThemeProvider,
  } = useThemeProvider()

  useBackButtonHandler(routeName => exitRoutes.includes(routeName))

  const { navStore } = useStores()
  function handleStateChange(state: NavigationState | undefined) {
    // @ts-ignore
    const { currentRouteName, previousRouteName } =
      props.onStateChange?.(state) ?? {}

    navStore.setProp('activeRoute', currentRouteName)
  }

  // const {
  //   theme: { isDark },
  // } = useAppTheme()

  const paperTheme = useMemo(() => {
    return paperThemes[themeScheme]
  }, [themeScheme])

  const navTheme = useMemo(() => {
    return navThemes[themeScheme === 'dark' ? 'DarkTheme' : 'LightTheme']
  }, [themeScheme])

  const screenDimensions = useWindowDimensions()

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <PaperProvider theme={paperTheme}>
        <ErrorBoundary
          fallback={({ error, resetError }) => (
            <Screens.ErrorDetailsScreen
              error={error}
              resetError={resetError}
            />
          )}
        >
          <PortalProvider>
            <Portal.Host>
              <DialogContextProvider>
                <NavigationContainer
                  ref={navigationRef}
                  theme={navigationTheme}
                  {...props}
                  onStateChange={handleStateChange}
                >
                  {/* The bar at the top */}
                  {/* <StatusBar
                    backgroundColor={
                      colorScheme === 'light' ? colors.primary : colors.shadow
                    }
                    barStyle={'light-content'}
                  /> */}
                  <AppStack />
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
    </ThemeProvider>
  )
})
