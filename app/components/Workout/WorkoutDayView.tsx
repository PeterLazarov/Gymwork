import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'

import WorkoutCommentsCard from './WorkoutCommentsCard'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutStepList from './WorkoutStepList'
import { useNavigation } from '@react-navigation/native'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const { navigate } = useNavigation()

  const { workoutStore, settingsStore } = useStores()

  const workout = workoutStore.dateWorkoutMap[date]

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      {workout ? (
        <>
          {settingsStore.showCommentsCard && workout.hasComments && (
            <WorkoutCommentsCard
              workout={workout}
              onPress={() =>
                navigate('Home', {
                  screen: 'WorkoutStack',
                  params: { screen: 'WorkoutFeedback', params: {} },
                })
              }
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
