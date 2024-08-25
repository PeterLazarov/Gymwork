import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import WorkoutExerciseHistoryList from './WorkoutExerciseHistoryList'
import { Workout } from 'app/db/models'

const WorkoutExerciseHistoryView: React.FC = () => {
  const { workoutStore, stateStore } = useStores()

  const workoutsContained =
    workoutStore.exerciseWorkouts[stateStore.openedExerciseGuid]

  const exerciseFilteredWorkouts = useMemo(
    () =>
      workoutsContained.map(workout => ({
        ...workout,
        sets: workout.sets.filter(
          e => e.exercise.guid === stateStore.openedExerciseGuid
        ),
      })) as Workout[],
    [workoutsContained]
  )

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
      {workoutsContained?.length > 0 ? (
        <WorkoutExerciseHistoryList workouts={exerciseFilteredWorkouts} />
      ) : (
        <EmptyState text={translate('historyLogEmpty')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
