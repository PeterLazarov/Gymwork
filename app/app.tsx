/* eslint-disable import/first */
if (__DEV__) {
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require('./devtools/ReactotronConfig.ts')
}
import { useFonts } from 'expo-font'
import React from 'react'
import * as Linking from 'expo-linking'
import { KeyboardAvoidingView, Platform, ViewStyle } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Portal } from 'react-native-paper'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'

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

import * as SystemUI from 'expo-system-ui'
import { colors } from 'designSystem'
SystemUI.setBackgroundColorAsync(colors.secondary)

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ height: '100%' }}
      >
        <DBStoreInitializer>
          <PaperProvider>
            <Portal.Host>
              <ErrorBoundary catchErrors={Config.catchErrors}>
                <GestureHandlerRootView style={$container}>
                  <AppNavigator
                    linking={linking}
                    initialState={initialNavigationState}
                    onStateChange={onNavigationStateChange}
                  />
                </GestureHandlerRootView>
              </ErrorBoundary>
            </Portal.Host>
          </PaperProvider>
        </DBStoreInitializer>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
