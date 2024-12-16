import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Exercise, WorkoutSet } from 'app/db/models'
import RecordsListItem from './RecordsListItem'
import { spacing } from 'designSystem'

export type ExerciseRecordReviewProps = {
  exercise?: Exercise
}

const ExerciseRecordReview: React.FC<ExerciseRecordReviewProps> = props => {
  const {
    stateStore,
    recordStore,
    navStore: { navigate },
  } = useStores()

  const exercise = props.exercise || stateStore.focusedExercise!
  const focusedExerciseRecords = recordStore.exerciseRecordsMap[exercise.guid]

  const recordSets = useMemo(
    () =>
      computed(() => {
        const copyRecords = focusedExerciseRecords?.recordSets.slice() || []
        return copyRecords.sort(
          (setA, setB) => setA.groupingValue - setB.groupingValue
        )
      }),
    [focusedExerciseRecords, exercise]
  ).get()

  function goToDate(set: WorkoutSet) {
    stateStore.setOpenedDate(set.date)
    stateStore.setProp('highlightedSetGuid', set.guid)
    stateStore.setProp('focusedExerciseGuid', set.exercise.guid)

    navigate('Workout')
  }

  return (
    <View style={styles.screen}>
      {recordSets.length > 0 ? (
        <ScrollView style={styles.list}>
          {recordSets.map(set => {
            return (
              <RecordsListItem
                key={set.guid}
                set={set}
                onPress={() => goToDate(set)}
              />
            )
          })}
        </ScrollView>
      ) : (
        <EmptyState text={translate('recordsLogEmpty')} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    marginTop: spacing.md,
    display: 'flex',
    flexGrow: 1,
  },
  list: {
    flexBasis: 0,
  },
})

export default observer(ExerciseRecordReview)