import React from 'react'

import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import { View } from 'react-native'
import { useColors } from 'designSystem'
import WorkoutDayView2 from 'app/components/Workout/WorkoutDayView2'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import { DateTime } from 'luxon'

const WorkoutPageScreen: React.FC = () => {
  const colors = useColors()

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
        <WorkoutHeader />

        <WorkoutDayView2 />
        {/* <WorkoutDayView date={DateTime.now().toISODate()} /> */}
      </View>
    </>
  )
}
export default WorkoutPageScreen
