import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseHistoryList from './WorkoutExerciseHistoryList'

const WorkoutExerciseHistoryView: React.FC = () => {
  const { workoutStore, stateStore } = useStores()

  const workoutsContained =
    workoutStore.exerciseWorkoutsHistoryMap[stateStore.openedExerciseGuid]

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
      {stateStore.openedExercise && workoutsContained?.length > 0 ? (
        <WorkoutExerciseHistoryList
          workouts={workoutsContained}
          records={stateStore.openedExerciseRecords}
          exercise={stateStore.openedExercise}
        />
      ) : (
        <EmptyState text={translate('historyLogEmpty')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
