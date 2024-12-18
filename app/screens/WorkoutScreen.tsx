import React from 'react'
import { View } from 'react-native'

import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'

export const WorkoutScreen: React.FC = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
        <WorkoutHeader />

        <WorkoutHorizontalList />
      </View>
    </>
  )
}
