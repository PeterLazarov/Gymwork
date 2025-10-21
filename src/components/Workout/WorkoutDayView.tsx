import React from "react"
import { View } from "react-native"

// import { useStores } from "app/db/helpers/useStores"
import { WorkoutStepList } from "./WorkoutStepList"
import WorkoutEmptyState from "./WorkoutEmptyState"
import { CommentsCard } from "./CommentsCard"
import { useColors } from "@/designSystem"
import { useOpenedDate } from "@/context/OpenedDateContext"

export const WorkoutDayView: React.FC = () => {
  const colors = useColors()
  const { openedDate } = useOpenedDate()
  // const {
  //   workoutStore,
  //   settingsStore,
  //   navStore: { navigate },
  // } = useStores()
  const workout = workoutStore.dateWorkoutMap[openedDate]

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout ? (
        <>
          {settingsStore.showCommentsCard && workout.hasComments && (
            <CommentsCard
              workout={workout}
              onPress={() => navigate("WorkoutFeedback")}
              compactMode
            />
          )}

          <WorkoutStepList workout={workout} />
        </>
      ) : (
        <WorkoutEmptyState />
      )}
    </View>
  )
}
