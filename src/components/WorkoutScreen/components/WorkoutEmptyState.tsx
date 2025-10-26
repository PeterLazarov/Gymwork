import React, { useMemo } from "react"
import { Alert, View } from "react-native"

import { spacing } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import { ActionCard } from "./ActionCard"

export const WorkoutEmptyState: React.FC = () => {
  const hasWorkouts = false
  const hasTemplates = false

  function startWorkout() {
    navigate("ExerciseSelect")
  }

  const secondaryActions = useMemo(() => {
    const result = [
      {
        icon: "copy-outline",
        text: translate("copyWorkout"),
        onPress: hasWorkouts ? copyWorkout : () => Alert.alert("", translate("copyWorkoutAlert")),
        forbidden: !hasWorkouts,
      },
      {
        icon: "download-outline",
        text: translate("useTemplate"),
        onPress: hasTemplates
          ? useTemplate
          : () =>
              // TODO revisit once templates can be created apart from workouts
              Alert.alert("", translate("useTemplateAlert")),
        forbidden: !hasTemplates,
      },
    ] as const

    return result
  }, [hasWorkouts, hasTemplates])

  function copyWorkout() {
    navigate("Calendar", {
      copyWorkoutMode: true,
    })
  }

  function useTemplate() {
    navigate("TemplateSelect")
  }

  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
        gap: spacing.md,
        justifyContent: "center",
      }}
    >
      <ActionCard
        onPress={startWorkout}
        icon="dumbbell"
      >
        {translate("startEmptyWorkout")}
      </ActionCard>
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
        }}
      >
        {secondaryActions.map((action) => (
          <View
            style={{ flexGrow: 1 }}
            key={action.text}
          >
            <ActionCard
              onPress={action.onPress}
              disabled={action.forbidden}
              icon={action.icon}
            >
              {action.text}
            </ActionCard>
          </View>
        ))}
      </View>
    </View>
  )
}
