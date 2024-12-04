/* eslint-disable import/first */
if (__DEV__) {
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require('./devtools/ReactotronConfig.ts')
}
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import './i18n'
import DBStoreInitializer from './db/DBStoreInitializer'
import { useInitialRootStore } from './db/helpers/useStores'
import { AppNavigator, useNavigationPersistence } from './navigators'
import './utils/ignoreWarnings'
import * as storage from './utils/storage'
import { useLogging } from './utils/useLogging'

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

function App() {
  useLogging()

  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const { rehydrated } = useInitialRootStore(() => {})

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !isNavigationStateRestored) {
    return null
  }

  return (
    <DBStoreInitializer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator
          linking={{
            enabled: true,
            prefixes: [
              'gymwork://', // App-specific scheme
              'http://localhost', // Prefix for universal links
              'https://gymwork.com', // Prefix for universal links
              'https://*.gymwork.com', // Prefix which matches any subdomain
            ],
          }}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </GestureHandlerRootView>
    </DBStoreInitializer>
  )
}

export default App
