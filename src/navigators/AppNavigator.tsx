import { PortalHost, PortalProvider } from "@gorhom/portal"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ErrorBoundary } from "@sentry/react-native"
import { View, useWindowDimensions } from "react-native"
import { Portal } from "react-native-paper"

import { DialogContextProvider } from "@/context/DialogContext"
import Config from "@/ignite/config"
import { useAppTheme } from "@/ignite/theme/context"
import { CalendarScreen } from "@/screens/CalendarScreen"
import { ErrorDetails } from "@/screens/ErrorDetails"
import { ExerciseDetailsScreen } from "@/screens/ExerciseDetails"
import { ExerciseEditScreen } from "@/screens/ExerciseEdit"
import { ExerciseSelectScreen } from "@/screens/ExerciseSelect"
import { TemplateSaveScreen } from "@/screens/TemplateSave"
import { UserFeedbackScreen } from "@/screens/UserFeedback"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { WorkoutScreen } from "@/screens/WorkoutScreen"
import { offscreenRef } from "@/utils/useShareWorkout"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

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
      <Stack.Screen
        name="ExerciseEdit"
        component={ExerciseEditScreen}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
      />
      <Stack.Screen
        name="TemplateSave"
        component={TemplateSaveScreen}
      />
      <Stack.Screen
        name="UserFeedback"
        component={UserFeedbackScreen}
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
