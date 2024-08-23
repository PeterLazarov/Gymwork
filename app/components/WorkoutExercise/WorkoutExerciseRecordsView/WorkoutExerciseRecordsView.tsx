import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { ExerciseRecordSet } from 'app/db/models/ExerciseRecordSet'
import { PressableHighlight } from 'designSystem'
import RecordsListItem from './RecordsListItem'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { openedExerciseRecords, stateStore } = useStores()

  function goToDate(set: ExerciseRecordSet) {
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
      {openedExerciseRecords.recordSets.length > 0 ? (
        <ScrollView
          style={{
            flexBasis: 0,
          }}
        >
          {openedExerciseRecords.recordSets
            .filter(record => !record.isWeakAss)
            .map((set, i) => {
              return (
                <PressableHighlight
                  key={set.guid}
                  style={{
                    paddingVertical: 4,
                  }}
                  onPress={() => goToDate(set)}
                >
                  <RecordsListItem
                    set={set}
                    exercise={stateStore.openedExercise!}
                  />
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
