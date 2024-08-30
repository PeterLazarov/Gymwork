import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseHistoryList from './ExerciseHistoryList'

const ExerciseHistoryView: React.FC = () => {
  const { stateStore, workoutStore, recordStore } = useStores()

  const exercise = stateStore.focusedStep?.exercise
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
