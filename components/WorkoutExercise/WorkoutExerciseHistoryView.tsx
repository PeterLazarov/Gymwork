import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView, Dimensions } from 'react-native'

import WorkoutExerciseHistoryDayItem from './WorkoutExerciseHistoryDayItem'
import { useStores } from '../../db/helpers/useStores'
import ExerciseHistoryChart from '../ExerciseHistory'

const padding = 16

const WorkoutExerciseHistory: React.FC = () => {
  const { workoutStore } = useStores()

  return (
    <View
      style={{
        // padding,
        margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <ExerciseHistoryChart
        view="ALL"
        exerciseID={workoutStore.openedExercise.exercise.guid}
        height={250}
        width={Dimensions.get('window').width - padding * 2}
      />
      <ScrollView style={{ marginTop: -24, flexBasis: 0 }}>
        {workoutStore.openedExerciseHistory.map(({ date, sets }) => (
          <WorkoutExerciseHistoryDayItem
            date={date}
            sets={sets}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseHistory)
