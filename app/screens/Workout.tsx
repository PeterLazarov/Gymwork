import { observer } from 'mobx-react-lite'
import React from 'react'

import DayControl from 'app/components/Workout/DayControl'
import WorkoutControlButtons from 'app/components/Workout/WorkoutControlButtons'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import Timer from 'app/components/Timer/Timer'
import Timer2 from 'app/components/Timer/Timer2'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'

const WorkoutPage: React.FC = () => {
  const { workoutStore, timeStore, stateStore } = useStores()

  function newWorkout() {
    workoutStore.createWorkout()
  }

  return (
    <EmptyLayout>
      <WorkoutHeader />
      <DayControl />
      {timeStore.stopwatchValue !== '' && stateStore.isOpenedWorkoutToday && (
        <Timer />
      )}
      <Timer2 />
      <WorkoutHorizontalList />
      <WorkoutControlButtons createWorkout={newWorkout} />
    </EmptyLayout>
  )
}
export default observer(WorkoutPage)
