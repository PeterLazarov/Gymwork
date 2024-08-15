/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require('./devtools/ReactotronConfig.ts')
}
import { useFonts } from 'expo-font'
import React from 'react'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ViewStyle } from 'react-native'

import Config from './config'
import './i18n'
import DBStoreInitializer from './db/DBStoreInitializer'
import { useInitialRootStore } from './db/helpers/useStores'
import { AppNavigator, useNavigationPersistence } from './navigators'
import './utils/ignoreWarnings'
import * as storage from './utils/storage'
import { ErrorBoundary } from './screens/ErrorScreen/ErrorBoundary'
import { customFontsToLoad } from './theme'
export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

// Web linking configuration
const prefix = Linking.createURL('/')
const config = {
  screens: {
    Login: {
      path: '',
    },
    Welcome: 'welcome',
    Demo: {
      screens: {
        DemoShowroom: {
          path: 'showroom/:queryIndex?/:itemIndex?',
        },
        DemoDebug: 'debug',
        DemoPodcastList: 'podcast',
        DemoCommunity: 'community',
      },
    },
  },
}

/**
 * This is the root component of our app.
 * @returns {JSX.Element} The rendered `App` component.
 */
function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {})

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (
    !rehydrated ||
    !isNavigationStateRestored ||
    (!areFontsLoaded && !fontLoadError)
  ) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <DBStoreInitializer>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <GestureHandlerRootView style={$container}>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </GestureHandlerRootView>
        </ErrorBoundary>
      </DBStoreInitializer>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
