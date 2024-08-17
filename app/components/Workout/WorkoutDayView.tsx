import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { colors } from 'designSystem'
import WorkoutExerciseList from './WorkoutExerciseList'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const { workoutStore } = useStores()
  const workout = workoutStore.getWorkoutForDate(date)

  return (
    <View style={{ backgroundColor: colors.lightgray, flex: 1 }}>
      {workout ? (
        <WorkoutExerciseList workout={workout} />
      ) : (
        <EmptyState text={translate('workoutLogEmpty')} />
      )}
    </View>
  )
}

export default observer(WorkoutDayView)
