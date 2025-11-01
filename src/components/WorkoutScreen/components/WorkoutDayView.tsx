import React, { useEffect, useMemo, useState } from "react"
import { Alert, View, StyleSheet } from "react-native"

import { useSetting } from "@/context/SettingContext"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { EmptyState, spacing, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { CommentsCard } from "@/components/shared/CommentsCard"
import { WorkoutStepList } from "./WorkoutStepList"
import { translate } from "@/utils"
import { ActionCard } from "./ActionCard"
import { useAllWorkoutIdsQuery } from "@/db/queries/useAllWorkoutIdsQuery"
import { useTemplatesQuery } from "@/db/queries/useTemplatesQuery"

type Props = {
  workout: WorkoutModel | null
}
export const WorkoutDayView: React.FC<Props> = ({ workout }) => {
  const colors = useColors()
  const { showCommentsCard } = useSetting()

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout ? (
        <>
          {showCommentsCard && workout.hasComments && (
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

  const templates = useTemplatesQuery({ limit: 1 })
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
    navigate("Calendar", {
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
