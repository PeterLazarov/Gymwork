import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ViewStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import { ThemedStyle } from 'designSystem'

import ExerciseHistoryList from './ExerciseHistoryList'

export type ExerciseHistoryViewProps = {
  exercise?: Exercise
}

const ExerciseHistoryStats: React.FC<ExerciseHistoryViewProps> = props => {
  const { themed } = useAppTheme()

  const { stateStore, workoutStore } = useStores()

  const exercise = props.exercise || stateStore.focusedExercise
  const workoutsContained = exercise
    ? workoutStore.exerciseWorkoutsHistoryMap[exercise.guid]?.filter(
        w => w.exerciseSetsMap[exercise.guid]!.length > 0
      ) || []
    : []

  return (
    <View style={themed($container)}>
      {exercise && workoutsContained?.length ? (
        <ExerciseHistoryList
          workouts={workoutsContained}
          exercise={exercise}
        />
      ) : (
        <EmptyState text={translate('historyLogEmpty')} />
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: spacing.lg,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
})

export default observer(ExerciseHistoryStats)
