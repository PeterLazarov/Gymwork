import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import ExerciseHistoryList from './ExerciseHistoryList'
import { spacing, useColors } from 'designSystem'
import { Exercise } from 'app/db/models'

export type ExerciseHistoryViewProps = {
  exercise?: Exercise
}

const ExerciseHistoryStats: React.FC<ExerciseHistoryViewProps> = props => {
  const colors = useColors()

  const { stateStore, workoutStore } = useStores()

  const styles = useMemo(() => makeStyles(colors), [colors])

  const exercise = props.exercise || stateStore.focusedExercise
  const workoutsContained = exercise
    ? workoutStore.exerciseWorkoutsHistoryMap[exercise.guid]?.filter(
        w => w.exerciseSetsMap[exercise.guid]!.length > 0
      ) || []
    : []

  return (
    <View style={styles.container}>
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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
      gap: spacing.lg,
      flexDirection: 'column',
      display: 'flex',
      flexGrow: 1,
    },
  })

export default observer(ExerciseHistoryStats)
