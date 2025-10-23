import React from "react"
import { View } from "react-native"

import { useSetting } from "@/context/SettingContext"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { CommentsCard } from "./CommentsCard"
import { WorkoutEmptyState } from "./WorkoutEmptyState"
import { WorkoutStepList } from "./WorkoutStepList"

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

          <WorkoutStepList workout={workout} />
        </>
      ) : (
        <WorkoutEmptyState />
      )}
    </View>
  )
}
