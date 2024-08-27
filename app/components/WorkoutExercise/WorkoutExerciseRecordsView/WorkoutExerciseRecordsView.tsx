import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { PressableHighlight } from 'designSystem'
import RecordsListItem from './RecordsListItem'
import { WorkoutSet } from 'app/db/models'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { stateStore } = useStores()

  const recordSets = useMemo(
    () =>
      computed(() => {
        const openedExerciseRecords = stateStore.openedExerciseRecords
        const copyRecords = openedExerciseRecords.recordSets.slice()
        return copyRecords.sort(
          (setA, setB) => setA.groupingValue - setB.groupingValue
        )
      }),
    [stateStore.openedExerciseSets]
  ).get()

  function goToDate(set: WorkoutSet) {
    stateStore.setProp('openedDate', set.date)
    navigate('Workout')
  }

  return (
    <View
      style={{
        paddingVertical: 16,
        borderRadius: 8,
        display: 'flex',
        flexGrow: 1,
      }}
    >
      {recordSets.length > 0 ? (
        <ScrollView
          style={{
            flexBasis: 0,
          }}
        >
          {recordSets.map((set, i) => {
            return (
              <PressableHighlight
                key={set.guid}
                style={{
                  paddingVertical: 4,
                }}
                onPress={() => goToDate(set)}
              >
                <RecordsListItem set={set} />
              </PressableHighlight>
            )
          })}
        </ScrollView>
      ) : (
        <EmptyState text={translate('recordsLogEmpty')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseRecordsView)
