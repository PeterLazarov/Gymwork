import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { observer } from 'mobx-react-lite'
import { getParentOfType } from 'mobx-state-tree'
import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetReadOnlyList/ReadOnlyListItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutModel, WorkoutSet } from '../../db/models'
import { AppStackParamList } from 'app/navigators'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { openedExerciseRecords, stateStore } = useStores()
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackParamList, 'WorkoutExercise'>
    >()

  // TODO extract out to action?
  function goToDate(set: WorkoutSet) {
    const workout = getParentOfType(set, WorkoutModel)
    stateStore.setProp('openedDate', workout.date)
    navigation.navigate('Workout')
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
              <WorkoutExerciseSetListItem
                set={set}
                hideRecords
                exercise={stateStore.openedExercise!}
              />
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseRecordsView)
