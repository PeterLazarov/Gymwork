import { useEffect, useState } from "react"
import { Slot, SplashScreen } from "expo-router"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { ThemeProvider as ThemeProviderExpoRouter } from "@react-navigation/native"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

import DrizzleProvider from "@/components/Providers/DrizzleProvider"
import ExpoSQLiteProvider from "@/components/Providers/ExpoSQLiteProvider"
import { initI18n } from "@/i18n"
import { ThemeProvider as ThemeProviderIgnite, useAppTheme } from "@/theme/context"
import { customFontsToLoad } from "@/theme/typography"
import { loadDateFnsLocale } from "@/utils/formatDate"

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")
}

export { ErrorBoundary } from "@/components/Ignite/ErrorBoundary/ErrorBoundary"

export default function Root() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const loaded = fontsLoaded && isI18nInitialized

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProviderIgnite>
        <KeyboardProvider>
          <RootLayoutChild>
            <ExpoSQLiteProvider>
              <DrizzleProvider>
                <Slot />
              </DrizzleProvider>
            </ExpoSQLiteProvider>
          </RootLayoutChild>
        </KeyboardProvider>
      </ThemeProviderIgnite>
    </SafeAreaProvider>
  )
}

function RootLayoutChild({ children }: { children: React.ReactNode }) {
  const { navigationTheme } = useAppTheme()
  return <ThemeProviderExpoRouter value={navigationTheme}>{children}</ThemeProviderExpoRouter>
}
