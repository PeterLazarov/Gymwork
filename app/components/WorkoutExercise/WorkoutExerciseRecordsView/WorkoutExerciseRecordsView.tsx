import { observer } from 'mobx-react-lite'
import { getParentOfType } from 'mobx-state-tree'
import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutModel, WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import SetListItem from '../WorkoutExerciseSetList/SetListItem'

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
        padding: 16,
        // margin: 16,
        borderRadius: 8,
        display: 'flex',
        flexGrow: 1,
      }}
    >
      {Object.values(openedExerciseRecords).length > 0 ? (
        <ScrollView
          style={{
            flexBasis: 0,
          }}
        >
          {Object.values(openedExerciseRecords).map((set, i) => {
            return (
              <TouchableOpacity
                key={set.guid}
                style={{
                  marginVertical: 4,
                }}
                onPress={() => goToDate(set)}
              >
                <SetListItem
                  set={set}
                  hideRecords
                  exercise={stateStore.openedExercise!}
                />
              </TouchableOpacity>
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
