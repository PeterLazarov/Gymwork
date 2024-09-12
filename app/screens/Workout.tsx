import React from 'react'

import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import { TabsLayout } from 'app/layouts/TabsLayout'

const WorkoutPageScreen: React.FC = () => {
  return (
    <TabsLayout activeRoute="Workout">
      <WorkoutHeader />

      <WorkoutHorizontalList />
    </TabsLayout>
  )
}
export default WorkoutPageScreen
