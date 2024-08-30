import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseHistoryList from './ExerciseHistoryList'
import { Exercise } from 'app/db/models'

type Props = {
  exercise?: Exercise
}
const ExerciseHistoryView: React.FC<Props> = ({ exercise }) => {
  const { workoutStore, recordStore } = useStores()

  const workoutsContained = exercise
    ? workoutStore.exerciseWorkoutsHistoryMap[exercise.guid]
    : []

  return (
    <View
      style={{
        margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
        display: 'flex',
        flexGrow: 1,
      }}
    >
      {exercise && workoutsContained.length > 0 ? (
        <WorkoutExerciseHistoryList
          workouts={workoutsContained}
          records={recordStore.exerciseRecordsMap[exercise.guid]}
          exercise={exercise}
        />
      ) : (
        <EmptyState text={translate('historyLogEmpty')} />
      )}
    </View>
  )
}

export default observer(ExerciseHistoryView)
