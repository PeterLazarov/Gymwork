/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import {
  NavigationContainer,
  NavigationState,
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ErrorBoundary } from '@sentry/react-native'
import { upperFirst } from 'lodash'
import { observer } from 'mobx-react-lite'
import { ComponentProps, useMemo } from 'react'
import {
  // StatusBar,
  useWindowDimensions,
  View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Portal } from 'react-native-paper'

import { Links } from '@/components/Links'
import { DialogContextProvider } from '@/contexts/DialogContext'
import { useStores } from '@/db/helpers/useStores'
import { translate } from '@/i18n'
import * as Screens from '@/screens'
import { useThemeProvider } from '@/utils/useAppTheme'
import { offscreenRef } from 'app/utils/useShareWorkout'
import { navThemes, paperThemes } from 'designSystem/theme'

import Config from '../config'

import { navigationRef, useBackButtonHandler } from './navigationUtilities'
/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

const AppStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions(props) {
    return {
      headerTransparent: true,
      headerBlurEffect: 'regular',

      headerShown: true,
      // TODO for testing
      headerRight() {
        return <Links />
      },
    }
  },
  screens: {
    Welcome: {
      screen: Screens.WelcomeScreen,
      linking: 'welcome',
      // if: !__DEV__ && !stateStore.visitedWelcomeScreen // TODO
    },
    Home: {
      options: {
        headerShown: true,
        headerRight() {
          return <Links />
        },
      },
      screen: createNativeBottomTabNavigator({
        // Configured here instead of per-route because the library is buggy
        screenOptions(props) {
          const options = {
            WorkoutStack: {
              title: upperFirst(translate('workout')),
              tabBarIcon: () =>
                MaterialIcons.getImageSourceSync(
                  'fitness-center',
                  24,
                  'black'
                )!,
            },
            ReviewStack: {
              title: upperFirst(translate('review')),
              tabBarIcon: () =>
                MaterialIcons.getImageSourceSync('history', 24, 'black')!,
            },
          }
          const routeName = props.route.name as keyof typeof options
          return options[routeName]
        },
        screens: {
          ReviewStack: createNativeStackNavigator({
            screens: {
              Review: {
                screen: Screens.ReviewScreen,
                linking: 'review',
              },
            },
          }),
          WorkoutStack: createNativeStackNavigator({
            screens: {
              Workout: {
                screen: Screens.WorkoutScreen,
                linking: 'workout/:workoutId',
              },
              WorkoutStep: {
                screen: Screens.WorkoutStepScreen,
                linking: 'workout/:workoutId/step/:stepId',
                options(props) {
                  return {
                    headerBackButtonDisplayMode: 'minimal',
                  }
                },
              },
              WorkoutFeedback: {
                screen: Screens.WorkoutFeedbackScreen,
                linking: 'workout/:workoutId/feedback',
              },
              TemplateSelect: {
                screen: Screens.TemplateSelectScreen,
              },
              SaveTemplate: {
                screen: Screens.SaveTemplateScreen,
              },
            },
          }),
        },
      }),
    },
    // common / duplicates?
    Settings: {
      screen: Screens.SettingsScreen,
      headerRight() {
        return <Links />
      },
    },
    Calendar: {
      screen: Screens.CalendarScreen,
    },
    // ExerciseSelect: {
    //   screen: Screens.ExerciseSelectScreen,
    //   headerRight() {
    //     return <Links />
    //   },
    // },
    ExerciseEdit: {
      screen: Screens.ExerciseEditScreen,
      headerRight() {
        return <Links />
      },
    },
    ExerciseDetails: {
      screen: Screens.ExerciseDetailsScreen,
      headerRight() {
        return <Links />
      },
    },
    UserFeedback: {
      screen: Screens.UserFeedbackScreen,
      headerRight() {
        return <Links />
      },
    },
  },
})

type RootStackParamList = StaticParamList<typeof AppStack>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(AppStack)

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
        <GestureHandlerRootView>
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
                  {/* The bar at the top */}
                  {/* <StatusBar
                    backgroundColor={
                      colorScheme === 'light' ? colors.primary : colors.shadow
                    }
                    barStyle={'light-content'}
                  /> */}
                  <Navigation
                    linking={{
                      enabled: true,
                      prefixes: [''], // TODO
                    }}
                    ref={navigationRef}
                    theme={navigationTheme}
                    {...props}
                    onStateChange={handleStateChange}
                  />
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
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  )
})
