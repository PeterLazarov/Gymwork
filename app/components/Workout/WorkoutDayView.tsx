import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import WorkoutStepList from './WorkoutStepList'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutCommentsCard from './WorkoutCommentsCard'
import AddStepMenu from './AddStepMenu'
import { useColors } from 'designSystem'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const colors = useColors()

  const {
    workoutStore,
    stateStore,
    navStore: { navigate },
  } = useStores()
  const workout = workoutStore.dateWorkoutMap[date]

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout && workout.steps.length > 0 ? (
        <>
          {stateStore.showCommentsCard && workout.hasComments && (
            <WorkoutCommentsCard
              workout={workout}
              onPress={() => navigate('WorkoutFeedback')}
            />
          )}
          <WorkoutStepList workout={workout} />
        </>
      ) : (
        <WorkoutEmptyState />
      )}
      <AddStepMenu />
    </View>
  )
}

export default observer(WorkoutDayView)
