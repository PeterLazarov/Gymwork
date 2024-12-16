import React from 'react'

import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import { View } from 'react-native'
import { useColors } from 'designSystem'

const WorkoutPageScreen: React.FC = () => {
  const colors = useColors()

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
        <WorkoutHeader />

        <WorkoutHorizontalList />
      </View>
    </>
  )
}
export default WorkoutPageScreen
