/* eslint-disable import/first */
if (__DEV__) {
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require('./devtools/ReactotronConfig.ts')
}
import { useFonts } from 'expo-font'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider, Portal } from 'react-native-paper'
import { KeyboardAvoiderProvider } from '@good-react-native/keyboard-avoider'
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
import { ErrorBoundary } from './screens/Error/ErrorBoundary'
import { customFontsToLoad } from './theme'
export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

import * as SystemUI from 'expo-system-ui'
import { colors } from 'designSystem'
import useTimer, { TimerContext } from './db/stores/useTimer'
SystemUI.setBackgroundColorAsync(colors.neutral)

function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const timer = useTimer()

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

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardAvoiderProvider>
        <DBStoreInitializer>
          <TimerContext.Provider value={timer}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Portal.Host>
                <ErrorBoundary catchErrors={Config.catchErrors}>
                  <PaperProvider>
                    <AppNavigator
                      initialState={initialNavigationState}
                      onStateChange={onNavigationStateChange}
                    />
                  </PaperProvider>
                </ErrorBoundary>
              </Portal.Host>
            </GestureHandlerRootView>
          </TimerContext.Provider>
        </DBStoreInitializer>
      </KeyboardAvoiderProvider>
    </SafeAreaProvider>
  )
}

export default App
