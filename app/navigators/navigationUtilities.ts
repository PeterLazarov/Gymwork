import { useState, useEffect, useRef } from 'react'
import { BackHandler, Linking, Platform } from 'react-native'
import {
  NavigationState,
  PartialState,
  createNavigationContainerRef,
} from '@react-navigation/native'
import Config from '../config'
import type { PersistNavigationConfig } from '../config/config.base'
import { useIsMounted } from '../utils/useIsMounted'
import type { AllStacksParamList, NavigationProps } from './AppNavigator'

import * as storage from '../utils/storage'

type Storage = typeof storage

/**
 * Reference to the root App Navigator.
 *
 * If needed, you can use this to access the navigation object outside of a
 * `NavigationContainer` context. However, it's recommended to use the `useNavigation` hook whenever possible.
 * @see [Navigating Without Navigation Prop]{@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
 *
 * The types on this reference will only let you reference top level navigators. If you have
 * nested navigators, you'll need to use the `useNavigation` with the stack navigator's ParamList type.
 */
export const navigationRef = createNavigationContainerRef<AllStacksParamList>()

/**
 * Gets the current screen from any navigation state.
 * @param {NavigationState | PartialState<NavigationState>} state - The navigation state to traverse.
 * @returns {string} - The name of the current screen.
 */
export function getActiveRouteName(
  state: NavigationState | PartialState<NavigationState>
): string {
  const route = state.routes[state.index ?? 0]

  // Found the active route -- return the name
  if (!route.state) return route.name as keyof AllStacksParamList

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state as NavigationState<AllStacksParamList>)
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 * @see [BackHandler]{@link https://reactnative.dev/docs/backhandler}
 * @param {(routeName: string) => boolean} canExit - Function that returns whether we can exit the app.
 * @returns {void}
 */
export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  // ignore unless android... no back button!
  if (Platform.OS !== 'android') return

  // The reason we're using a ref here is because we need to be able
  // to update the canExit function without re-setting up all the listeners
  const canExitRef = useRef(canExit)

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false
      }

      // grab the current route
      const routeName = getActiveRouteName(navigationRef.getRootState())

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // exit and let the system know we've handled the event
        BackHandler.exitApp()
        return true
      }

      // we can't exit, so let's turn this into a back action
      if (navigationRef.canGoBack()) {
        navigationRef.goBack()
        return true
      }

      return false
    }

    // Subscribe when we come to life
    BackHandler.addEventListener('hardwareBackPress', onBackPress)

    // Unsubscribe when we're done
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
  }, [])
}

/**
 * This helper function will determine whether we should enable navigation persistence
 * based on a config setting and the __DEV__ environment (dev or prod).
 * @param {PersistNavigationConfig} persistNavigation - The config setting for navigation persistence.
 * @returns {boolean} - Whether to restore navigation state by default.
 */
function navigationRestoredDefaultState(
  persistNavigation: PersistNavigationConfig
) {
  if (persistNavigation === 'always') return false
  if (persistNavigation === 'dev' && __DEV__) return false
  if (persistNavigation === 'prod' && !__DEV__) return false

  // all other cases, disable restoration by returning true
  return true
}

/**
 * Custom hook for persisting navigation state.
 * @param {Storage} storage - The storage utility to use.
 * @param {string} persistenceKey - The key to use for storing the navigation state.
 * @returns {object} - The navigation state and persistence functions.
 */
export function useNavigationPersistence(
  storage: Storage,
  persistenceKey: string
) {
  const [initialNavigationState, setInitialNavigationState] =
    useState<NavigationProps['initialState']>()
  const isMounted = useIsMounted()

  const initNavState = navigationRestoredDefaultState(Config.persistNavigation)
  const [isRestored, setIsRestored] = useState(initNavState)

  const routeNameRef = useRef<keyof AllStacksParamList | undefined>()

  const onNavigationStateChange = (state: NavigationState | undefined) => {
    const previousRouteName = routeNameRef.current
    if (state !== undefined) {
      const currentRouteName = getActiveRouteName(state)

      if (previousRouteName !== currentRouteName) {
        // track screens.
        if (__DEV__) {
          console.log(currentRouteName)
        }
      }

      // Save the current route name for later comparison
      routeNameRef.current = currentRouteName as keyof AllStacksParamList

      // Persist state to storage
      storage.save(persistenceKey, state)

      return { currentRouteName, previousRouteName }
    }
  }

  const restoreState = async () => {
    try {
      const initialUrl = await Linking.getInitialURL()

      // Only restore the state if app has not started from a deep link
      if (!initialUrl) {
        const state = (await storage.load(persistenceKey)) as
          | NavigationProps['initialState']
          | null
        if (state) setInitialNavigationState(state)
      }
    } finally {
      if (isMounted()) setIsRestored(true)
    }
  }

  useEffect(() => {
    if (!isRestored) restoreState()
  }, [isRestored])

  return {
    onNavigationStateChange,
    restoreState,
    isRestored,
    initialNavigationState,
  }
}
