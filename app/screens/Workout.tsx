import React from 'react'

import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import { View } from 'react-native'
import { useColors } from 'designSystem'
import WorkoutDayView2 from 'app/components/Workout/WorkoutDayView2'

const WorkoutPageScreen: React.FC = () => {
  const colors = useColors()

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
        <WorkoutHeader />

        <WorkoutDayView2 />
      </View>
    </>
  )
}
export default WorkoutPageScreen
