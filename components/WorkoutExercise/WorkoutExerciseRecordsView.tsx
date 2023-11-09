import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'

const WorkoutExerciseRecordsView: React.FC = () => {
  const { workoutStore } = useStores()

  return (
    <View
      style={{
        padding: 16,
        // margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <ScrollView>
        {workoutStore.openedExerciseActualRecords.map((record, i) => {
          return (
            <View key={i}>
              <WorkoutExerciseSetListItem set={record} />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseRecordsView)
