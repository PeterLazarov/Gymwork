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
    workoutStore.exerciseWorkoutsHistoryMap[
      stateStore.openedStep!.exercise.guid
    ]

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
      {stateStore.openedStep && workoutsContained.length > 0 ? (
        <WorkoutExerciseHistoryList
          workouts={workoutsContained}
          records={stateStore.openedExerciseRecords}
          exercise={stateStore.openedStep.exercise}
        />
      ) : (
        <EmptyState text={translate('historyLogEmpty')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
