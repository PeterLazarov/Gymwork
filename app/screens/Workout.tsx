import { observer } from 'mobx-react-lite'
import React from 'react'

import DayControl from 'app/components/Workout/DayControl'
import WorkoutControlButtons from 'app/components/Workout/WorkoutControlButtons'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import Timer from 'app/components/Timer/Timer'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'

const WorkoutPage: React.FC = () => {
  const { timeStore, stateStore } = useStores()

  return (
    <EmptyLayout>
      <WorkoutHeader />
      <DayControl />
      {timeStore.stopwatchValue !== '' && stateStore.isOpenedWorkoutToday && (
        <Timer />
      )}
      <WorkoutHorizontalList />
      <WorkoutControlButtons />
    </EmptyLayout>
  )
}
export default observer(WorkoutPage)
