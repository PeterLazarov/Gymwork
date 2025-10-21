/* eslint-disable import/first */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"

import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import { useEffect, useMemo, useState } from "react"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { PaperProvider, Portal } from "react-native-paper"

import DBProvider from "@/db/DBProvider"
import { initI18n } from "./ignite/i18n"
import { AppNavigator } from "@/navigators/AppNavigator"
import { useNavigationPersistence } from "./navigators/navigationUtilities"
import { ThemeProvider } from "./ignite/theme/context"
import { customFontsToLoad } from "./ignite/theme/typography"
// import { loadDateFnsLocale } from "./utils/formatDate"
import { OpenedDateProvider } from "@/context/OpenedDateContext"
import { useColorScheme } from "react-native"
import { paperThemes } from "@/designSystem"
import { DialogContextProvider } from "@/context/DialogContext"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

export function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n().then(() => setIsI18nInitialized(true))
    // .then(() => loadDateFnsLocale())
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored || !isI18nInitialized || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }
  const colorScheme = useColorScheme()!
  const paperTheme = useMemo(() => {
    return paperThemes[colorScheme]
  }, [colorScheme])

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <DBProvider>
          <ThemeProvider>
            <OpenedDateProvider>
              <PaperProvider theme={paperTheme}>
                <AppNavigator
                  linking={linking}
                  initialState={initialNavigationState}
                  onStateChange={onNavigationStateChange}
                />
              </PaperProvider>
            </OpenedDateProvider>
          </ThemeProvider>
        </DBProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}
