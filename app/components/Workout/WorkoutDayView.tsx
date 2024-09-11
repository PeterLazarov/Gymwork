import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import WorkoutStepList from './WorkoutStepList'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutCommentsCard from './WorkoutCommentsCard'
import AddStepMenu from './AddStepMenu'
import { colors } from 'designSystem'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const { workoutStore, stateStore } = useStores()
  const workout = workoutStore.dateWorkoutMap[date]

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.neutralLight }}>
        {workout && workout.steps.length > 0 ? (
          <>
            {stateStore.showCommentsCard && workout.hasComments && (
              <WorkoutCommentsCard />
            )}
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
