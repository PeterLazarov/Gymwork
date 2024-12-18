import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'

import WorkoutCommentsCard from './WorkoutCommentsCard'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutStepList from './WorkoutStepList'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    workoutStore,
    settingsStore,
    navStore: { navigate },
  } = useStores()
  const workout = workoutStore.dateWorkoutMap[date]

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout ? (
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
