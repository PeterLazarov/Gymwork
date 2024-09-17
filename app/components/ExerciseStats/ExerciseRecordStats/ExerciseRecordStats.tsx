import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { useColors } from 'designSystem'
import { Exercise, WorkoutSet } from 'app/db/models'
import RecordsListItem from './RecordsListItem'

export type ExerciseRecordStatsProps = {
  exercise?: Exercise
}

const ExerciseRecordStats: React.FC<ExerciseRecordStatsProps> = props => {
  const colors = useColors()

  const { stateStore, recordStore } = useStores()

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
  console.log('ExerciseRecordStats')

  return (
    <View
      style={{
        paddingVertical: 16,
        borderRadius: 8,
        display: 'flex',
        flexGrow: 1,
        backgroundColor: colors.neutralLighter,
      }}
    >
      {recordSets.length > 0 ? (
        <ScrollView
          style={{
            flexBasis: 0,
          }}
        >
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

export default observer(ExerciseRecordStats)
