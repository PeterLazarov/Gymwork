import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import { getParentOfType } from 'mobx-state-tree'
import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetReadOnlyListItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutModel, WorkoutSet } from '../../db/models'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { workoutStore, openedExercise } = useStores()
  const router = useRouter()

  // TODO extract out to action?
  function goToDate(set: WorkoutSet) {
    const workout = getParentOfType(set, WorkoutModel)
    workoutStore.setProp('openedDate', workout.date)
    router.push('/')
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
        {Object.values(workoutStore.openedExerciseRecords).map((set, i) => {
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
                exercise={openedExercise!}
              />
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseRecordsView)
