import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseHistoryList from './ExerciseHistoryList'
import { colors } from 'designSystem'

const ExerciseHistoryView: React.FC = () => {
  const { stateStore, workoutStore, recordStore } = useStores()

  const exercise = stateStore.focusedExercise
  const workoutsContained = exercise
    ? workoutStore.exerciseWorkoutsHistoryMap[exercise.guid]
    : []

  return (
    <View
      style={{
        paddingTop: 16,
        paddingHorizontal: 16,
        gap: 24,
        flexDirection: 'column',
        display: 'flex',
        flexGrow: 1,
        backgroundColor: colors.neutralLighter,
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
