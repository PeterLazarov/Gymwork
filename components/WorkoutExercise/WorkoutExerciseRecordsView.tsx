import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'

const WorkoutExerciseRecords: React.FC = () => {
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
        {workoutStore.openedExerciseActualRecords.map(record => {
          return (
            <WorkoutExerciseSetListItem
              set={record}
              key={record.guid}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseRecords)
