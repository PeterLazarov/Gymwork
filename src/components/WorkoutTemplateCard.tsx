import { Platform, PlatformColor, View, ViewProps } from "react-native"

import { Text } from "@/components/Ignite/Text"
import { SelectTemplateWorkout } from "@/db/sqlite/schema"
import { useAppTheme } from "@/theme/context"

export type WorkoutTemplateCardProps = { template: SelectTemplateWorkout } & ViewProps

export function WorkoutTemplateCard(props: WorkoutTemplateCardProps) {
  const { theme } = useAppTheme()

  const { template, style, ...rest } = props
  return (
    <View
      style={[
        {
          borderRadius: theme.spacing.lg,
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
      <Text>name: {template.name}</Text>
      <Text>...</Text>
      <Text>...</Text>
    </View>
  )
}
