import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseList from './WorkoutExerciseList'
import EmptyState from '../EmptyState'

type Props = {
  date: string
}
const WorkoutDayView: React.FC<Props> = ({ date }) => {
  const { workoutStore } = useStores()
  const workout = workoutStore.getWorkoutForDate(date)

  return workout ? (
    <WorkoutExerciseList workout={workout} />
  ) : (
    <EmptyState text={translate('workoutLogEmpty')} />
  )
}

export default observer(WorkoutDayView)
