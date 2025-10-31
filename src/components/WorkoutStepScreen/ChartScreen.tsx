import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { Text, useColors } from "@/designSystem"
import { WorkoutStepTabScreenProps } from "@/navigators/navigationTypes"
import { StyleSheet, View } from "react-native"

export type ChartScreenParams = {
  focusedStep: WorkoutStepModel
}

export const ChartScreen: React.FC<WorkoutStepTabScreenProps<"Chart">> = ({ route }) => {
  const { focusedStep: routeStep } = route.params
  const { openedWorkout } = useOpenedWorkout()
  const focusedStep = openedWorkout?.workoutSteps.find((s) => s.id === routeStep.id) || routeStep
  const colors = useColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Progress Chart</Text>
        <Text style={styles.subtitle}>Performance trends for {focusedStep.exercise.name}</Text>
        {/* TODO: Implement chart visualization */}
        <View style={styles.placeholder}>
          <Text>Coming soon: Progress charts and analytics</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
