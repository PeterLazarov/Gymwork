import React, { useMemo } from "react"
import { Alert, StyleSheet, View } from "react-native"

import { CommentsCard } from "@/components/shared/CommentsCard"
import { useAllWorkoutIds, useSettings, useTemplates } from "@/db/hooks"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { AppColors, EmptyState, Skeleton, spacing, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import { ActionCard } from "./ActionCard"
import { WorkoutStepList } from "./WorkoutStepList"

const ITEM_ESTIMATED_HEIGHT = 240
type Props = {
  workout: WorkoutModel | null
  isLoading?: boolean
}
export const WorkoutDayView: React.FC<Props> = ({ workout, isLoading }) => {
  const colors = useColors()
  const { data: settings } = useSettings()

  const styles = makeStyles(colors)

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        <Skeleton
          height={ITEM_ESTIMATED_HEIGHT}
          style={styles.skeletonItem}
        />
      </View>
    )
  }

  return (
    <View style={styles.dayViewContainer}>
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
  const { data: templates } = useTemplates()
  const { data: workoutIds } = useAllWorkoutIds({ limit: 1 })
  const hasWorkouts = workoutIds && workoutIds.length > 0
  const hasTemplates = templates && templates.length > 0
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

  const styles = makeStyles()

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

const makeStyles = (colors?: AppColors) =>
  StyleSheet.create({
    dayViewContainer: {
      flex: 1,
      backgroundColor: colors?.surfaceContainer,
    },
    skeletonContainer: {
      flex: 1,
      backgroundColor: colors?.surfaceContainer,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      // alignItems: "center",
      justifyContent: "center",
    },
    skeletonItem: {
      marginBottom: spacing.sm,
    },
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
