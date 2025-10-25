import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { PortalHost, PortalProvider } from "@gorhom/portal"
import { View, useWindowDimensions } from "react-native"
import { ErrorBoundary } from "@sentry/react-native"
import { Portal } from "react-native-paper"

import Config from "@/ignite/config"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { useAppTheme } from "@/ignite/theme/context"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { DialogContextProvider } from "@/context/DialogContext"
import { ErrorDetails } from "@/screens/ErrorDetails"
import { WorkoutScreen } from "@/screens/WorkoutScreen"
import { offscreenRef } from "@/utils/useShareWorkout"
import { CalendarScreen } from "@/screens/CalendarScreen"
import { ExerciseSelectScreen } from "@/screens/ExerciseSelect"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  const hasVisitedWelcome = false

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={hasVisitedWelcome ? "Welcome" : "Workout"}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
      />
      <Stack.Screen
        name="ExerciseSelect"
        component={ExerciseSelectScreen}
      />
    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))
  const screenDimensions = useWindowDimensions()

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      {...props}
    >
      <PortalProvider>
        <Portal.Host>
          <DialogContextProvider>
            <ErrorBoundary
              fallback={({ error, resetError }) => (
                <ErrorDetails
                  error={error}
                  resetError={resetError}
                />
              )}
            >
              <AppStack />
            </ErrorBoundary>
          </DialogContextProvider>
        </Portal.Host>

        <View
          ref={offscreenRef}
          style={{
            position: "absolute",
            zIndex: 1,
            left: screenDimensions.width,
          }}
        >
          <PortalHost name="offscreen" />
        </View>
      </PortalProvider>
    </NavigationContainer>
  )
}
