import { Platform, PlatformColor, View, ViewProps } from "react-native"

import { Text } from "@/components/Ignite/Text"
import { SelectWorkout } from "@/db/sqlite/schema"
import { useAppTheme } from "@/theme/context"

export interface WorkoutOverviewContinueCardProps extends ViewProps {
  workout: SelectWorkout
}

export function WorkoutOverviewContinueCard(props: WorkoutOverviewContinueCardProps) {
  const { theme } = useAppTheme()

  const { workout, style, ...rest } = props

  return (
    <View
      style={[
        {
          borderRadius: theme.rounding.md,
          padding: theme.spacing.md,
          backgroundColor: Platform.select({
            ios: PlatformColor("systemGray5"),
            android: "gray",
          }),
        },
        style ?? {},
      ]}
      {...rest}
    >
      <Text>name: {workout.name}</Text>
      <Text>Exercises</Text>
      <Text>Duration</Text>
    </View>
  )
}
