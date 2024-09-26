import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import WorkoutStepList from './WorkoutStepList'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutCommentsCard from './WorkoutCommentsCard'
import { useColors } from 'designSystem'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const colors = useColors()

  const {
    workoutStore,
    settingsStore,
    navStore: { navigate },
  } = useStores()
  const workout = workoutStore.dateWorkoutMap[date]

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout && workout.steps.length > 0 ? (
        <>
          {settingsStore.showCommentsCard && workout.hasComments && (
            <WorkoutCommentsCard
              workout={workout}
              onPress={() => navigate('WorkoutFeedback')}
              compactMode
            />
          )}
          <WorkoutStepList workout={workout} />
        </>
      ) : (
        <WorkoutEmptyState />
      )}
    </View>
  )
}

export default observer(WorkoutDayView)
