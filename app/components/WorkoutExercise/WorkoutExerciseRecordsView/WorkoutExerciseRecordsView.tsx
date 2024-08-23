import { observer } from 'mobx-react-lite'
import { getParentOfType } from 'mobx-state-tree'
import React from 'react'
import { View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutModel, WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import RecordsListItem from './RecordsListItem'
import { PressableHighlight } from 'designSystem'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { openedExerciseRecords, stateStore } = useStores()

  // TODO extract out to action?
  function goToDate(set: WorkoutSet) {
    const workout = getParentOfType(set, WorkoutModel)
    stateStore.setProp('openedDate', workout.date)
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
      {openedExerciseRecords.length > 0 ? (
        <ScrollView
          style={{
            flexBasis: 0,
          }}
        >
          {openedExerciseRecords.map((set, i) => {
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
                  exercise={stateStore.openedExercise}
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
