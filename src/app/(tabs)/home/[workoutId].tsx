import { useLocalSearchParams } from "expo-router"

import { Screen } from "@/components/Ignite/Screen"
import { Text } from "@/components/Ignite/Text"
import Workout from "@/components/Workout.tsx/Workout"
import { rounding } from "@/theme/rounding"

export default function WorkoutScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>()

  return (
    <Screen
      // style={{ backgroundColor: "red" }}

      contentContainerStyle={{
        // backgroundColor: "blue",
        flex: 1,
      }}
    >
      <Text>Workout Screen</Text>
      <Text>ID: {workoutId}</Text>

      {workoutId && (
        <Workout
          workoutId={workoutId}
          style={{
            borderRadius: rounding.md,
            flex: 1,
          }}
        />
      )}
    </Screen>
  )
}
