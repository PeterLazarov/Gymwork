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
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <ScrollView
        style={{
          flexBasis: 0,
        }}
      >
        {workoutStore.openedExerciseActualRecords.map((record, i) => {
          return (
            <View
              style={{
                marginVertical: 4,
              }}
            >
              <WorkoutExerciseSetListItem
                key={i}
                set={record}
              />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseRecordsView)
