import React, { useEffect, useMemo, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"

import { CommentsCard } from "@/components/shared/CommentsCard"
import { useSetting } from "@/context/SettingContext"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useAllWorkoutIdsQuery } from "@/db/queries/useAllWorkoutIdsQuery"
import { useTemplatesQuery } from "@/db/queries/useTemplatesQuery"
import { EmptyState, spacing, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import { ActionCard } from "./ActionCard"
import { WorkoutStepList } from "./WorkoutStepList"
import { useSettingsQuery } from "@/db/queries/useSettingsQuery"

type Props = {
  workout: WorkoutModel | null
}
export const WorkoutDayView: React.FC<Props> = ({ workout }) => {
  const colors = useColors()
  const { settings } = useSettingsQuery()

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout ? (
        <>
          {settings?.show_comments_card && workout.hasComments && (
            <CommentsCard
              workout={workout}
              onPress={() => navigate("WorkoutFeedback")}
              compactMode
            />
          )}

          {workout.workoutSteps.length > 0 && <WorkoutStepList workout={workout} />}
          {workout.workoutSteps.length === 0 && <EmptyState text={translate("noExercisesAdded")} />}
        </>
      ) : (
        <WorkoutEmptyState />
      )}
    </View>
  )
}

export const WorkoutEmptyState: React.FC = () => {
  const [hasWorkouts, setHasWorkouts] = useState(false)

  const { templates } = useTemplatesQuery({ limit: 1 })
  const workoutsQuery = useAllWorkoutIdsQuery()
  useEffect(() => {
    workoutsQuery({ limit: 1 }).then((res) => {
      setHasWorkouts(res.length > 0)
    })
  }, [])

  const hasTemplates = useMemo(() => templates.length > 0, [templates])
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
    navigate("WorkoutsHistory", {
      copyWorkoutMode: true,
    })
  }

  function useTemplate() {
    navigate("TemplateSelect")
  }

  const styles = makeStyles(spacing)

  return (
    <View style={styles.emptyStateContainer}>
      <ActionCard
        onPress={startWorkout}
        icon="dumbbell"
      >
        {translate("startEmptyWorkout")}
      </ActionCard>
      <View style={styles.secondaryActionRow}>
        {secondaryActions.map((action) => (
          <View
            style={styles.secondaryActionItem}
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

const makeStyles = (spacing: any) =>
  StyleSheet.create({
    emptyStateContainer: {
      flex: 1,
      padding: spacing.md,
      gap: spacing.md,
      justifyContent: "center",
    },
    secondaryActionRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    secondaryActionItem: { flexGrow: 1 },
  })
