import { PortalHost, PortalProvider } from "@gorhom/portal"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ErrorBoundary } from "@sentry/react-native"
import { View, useWindowDimensions } from "react-native"
import { Portal } from "react-native-paper"

import { CalendarScreen } from "@/components/CalendarScreen"
import { ErrorDetails } from "@/components/ErrorDetails"
import { ExerciseDetailsScreen } from "@/components/ExerciseDetailsScreen"
import { ExerciseEditScreen } from "@/components/ExerciseEditScreen"
import { ExerciseSelectScreen } from "@/components/ExerciseSelectScreen"
import { TemplateSaveScreen } from "@/components/TemplateSaveScreen"
import { UserFeedbackScreen } from "@/components/UserFeedbackScreen"
import { WelcomeScreen } from "@/components/WelcomeScreen"
import { WorkoutFeedbackScreen } from "@/components/WorkoutFeedbackScreen"
import { WorkoutScreen } from "@/components/WorkoutScreen"
import { offscreenRef } from "@/components/WorkoutScreen/utils/useShareWorkout"
import { WorkoutStepScreen } from "@/components/WorkoutStepScreen"
import { DialogContextProvider } from "@/context/DialogContext"
import Config from "@/ignite/config"
import { useAppTheme } from "@/ignite/theme/context"
import type { AppStackParamList, NavigationProps, WorkoutStepTabParamList } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

const Stack = createNativeStackNavigator<AppStackParamList>()
const WorkoutStepTab = createBottomTabNavigator<WorkoutStepTabParamList>()

const WorkoutStepTabs = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <WorkoutStepTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <WorkoutStepTab.Screen
        name="Track"
        component={WorkoutStepScreen}
        options={{
          tabBarLabel: "Track",
        }}
      />
      <WorkoutStepTab.Screen
        name="History"
        component={WorkoutStepScreen}
        options={{
          tabBarLabel: "History",
        }}
      />
    </WorkoutStepTab.Navigator>
  )
}

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
      <Stack.Screen
        name="WorkoutFeedback"
        component={WorkoutFeedbackScreen}
      />
      <Stack.Screen
        name="WorkoutStep"
        component={WorkoutStepTabs}
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
                  error={error as Error}
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
