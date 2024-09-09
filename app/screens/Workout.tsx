import { observer } from 'mobx-react-lite'
import React from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'

const WorkoutPageScreen: React.FC = () => {
  return (
    <EmptyLayout>
      <WorkoutHeader />

      <WorkoutDayView />
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
