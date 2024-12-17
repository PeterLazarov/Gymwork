/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer, NavigationState, NavigatorScreenParams, RouteProp, useRoute } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import {

  ComponentProps,
  useMemo
} from "react"
import {
  StatusBar,
  useColorScheme,
  useWindowDimensions,
  View
} from 'react-native'
import { ErrorBoundary, } from '@sentry/react-native'
import { PortalHost, PortalProvider } from '@gorhom/portal'

import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import Config from "../config"
import * as Screens from "@/screens"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useStores } from "@/db/helpers/useStores"
import { navThemes, paperThemes, useColors } from "designSystem"
import TabsLayout from "@/layouts/TabsLayout"
import { PaperProvider, Portal } from "react-native-paper"
import { DialogContextProvider } from "@/contexts/DialogContext"

import { offscreenRef } from 'app/utils/useShareWorkout'


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

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  // const {
  //   theme: { colors },
  // } = useAppTheme()

  const { stateStore } = useStores()

  const shouldShowWelcome = !__DEV__ && !stateStore.visitedWelcomeScreen

  const colors = useColors()
  const colorScheme = useColorScheme()

  // TODO native header?
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        // navigationBarColor: colors.background,
        navigationBarColor: colorScheme === 'light' ? colors.surface : colors.shadow,
        contentStyle: {
          backgroundColor: colorScheme === 'light' ? colors.surface : colors.shadow,
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
                  component={Screens.ReviewScreen}
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
                </HomeStack.Screen>
              </HomeStack.Navigator>
            </TabsLayout>
          )
        }}
      </Stack.Screen>

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

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> { }

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

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

  const screenDimensions = useWindowDimensions()

  return (
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
              <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
                <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
                  {/* The bar at the top */}
                  {/* <StatusBar
                    backgroundColor={
                      colorScheme === 'light' ? colors.primary : colors.shadow
                    }
                    barStyle={'light-content'}
                  /> */}
                  <AppStack />
                </NavigationContainer>
              </ThemeProvider>
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
