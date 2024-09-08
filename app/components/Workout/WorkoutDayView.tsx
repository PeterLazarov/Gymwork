import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import WorkoutStepList from './WorkoutStepList'
import DayControl from './DayControl'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutCommentsCard from './WorkoutCommentsCard'
import AddStepMenu from './AddStepMenu'

const WorkoutDayView: React.FC = () => {
  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout

  return (
    <>
      <DayControl duration={workout?.duration} />
      <View style={{ flex: 1 }}>
        {workout ? (
          <>
            {stateStore.showCommentsCard && <WorkoutCommentsCard />}
            <WorkoutStepList workout={workout} />
          </>
        ) : (
          <WorkoutEmptyState />
        )}
      </View>
      <AddStepMenu />
    </>
  )
}

export default observer(WorkoutDayView)
