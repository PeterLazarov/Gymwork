import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { Text, useColors } from "@/designSystem"
import { WorkoutStepTabScreenProps } from "@/navigators/navigationTypes"
import { StyleSheet, View } from "react-native"

export type RecordsScreenParams = {
  focusedStep: WorkoutStepModel
}

export const RecordsScreen: React.FC<WorkoutStepTabScreenProps<"Records">> = ({ route }) => {
  const { focusedStep: routeStep } = route.params
  const { openedWorkout } = useOpenedWorkout()
  const focusedStep = openedWorkout?.workoutSteps.find((s) => s.id === routeStep.id) || routeStep
  const colors = useColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Records</Text>
        <Text style={styles.subtitle}>Personal records for {focusedStep.exercise.name}</Text>
        {/* TODO: Implement records display */}
        <View style={styles.placeholder}>
          <Text>Coming soon: Personal records tracking</Text>
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
