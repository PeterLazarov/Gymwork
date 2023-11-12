import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView, Dimensions } from 'react-native'

import WorkoutExerciseHistoryDayItem from './WorkoutExerciseHistoryDayItem'
import { useStores } from '../../db/helpers/useStores'
import ExerciseHistoryChart from '../ExerciseHistoryChart'

const padding = 16

const WorkoutExerciseHistoryView: React.FC = () => {
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
        exerciseID={workoutStore.openedExerciseGuid}
        height={250}
        width={Dimensions.get('window').width - padding * 2}
      />
      <ScrollView style={{ marginTop: -24, flexBasis: 0 }}>
        {workoutStore.exerciseWorkouts[workoutStore.openedExerciseGuid]?.map(
          (workout, i) => (
            <WorkoutExerciseHistoryDayItem
              key={`${workout.date}_${i}`}
              date={workout.date}
              sets={workout.sets.filter(
                e => e.exercise.guid === workoutStore.openedExerciseGuid
              )}
            />
          )
        )}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
