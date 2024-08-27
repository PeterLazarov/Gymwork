import { observer } from 'mobx-react-lite'
import React from 'react'

import DayControl from 'app/components/Workout/DayControl'
import WorkoutControlButtons from 'app/components/Workout/WorkoutControlButtons'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'

const WorkoutPage: React.FC = () => {
  return (
    <EmptyLayout>
      <WorkoutHeader />
      <DayControl />
      <WorkoutHorizontalList />
      <WorkoutControlButtons />
    </EmptyLayout>
  )
}
export default observer(WorkoutPage)
