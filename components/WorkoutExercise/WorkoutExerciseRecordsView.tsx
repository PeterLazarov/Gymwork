import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import { getParentOfType } from 'mobx-state-tree'
import React from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutModel, WorkoutSet } from '../../db/models'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  // TODO extract out to action?
  function goToDate(set: WorkoutSet) {
    const workout = getParentOfType(set, WorkoutModel)
    workoutStore.setProp('currentWorkoutDate', workout.date)
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
            <View
              key={set.guid}
              style={{
                marginVertical: 4,
              }}
              onTouchEnd={() => goToDate(set)}
            >
              <WorkoutExerciseSetListItem
                set={set}
                hideRecords
              />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseRecordsView)
