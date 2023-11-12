import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, ScrollView, Dimensions } from 'react-native'

import WorkoutExerciseHistoryDayItem from './WorkoutExerciseHistoryDayItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'
import ExerciseHistoryChart from '../ExerciseHistory'

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
        exerciseID={workoutStore.openedWorkoutExercise.exercise.guid}
        height={250}
        width={Dimensions.get('window').width - padding * 2}
      />
      <ScrollView style={{ marginTop: -24, flexBasis: 0 }}>
        {workoutStore.exerciseWorkouts[
          workoutStore.openedWorkoutExercise.exercise.guid
        ]?.map((workout, i) => (
          <WorkoutExerciseHistoryDayItem
            key={`${workout.date}_${i}`}
            date={workout.date}
            sets={
              workout.exercises
                .filter(
                  e =>
                    e.exercise.guid ===
                    workoutStore.openedWorkoutExercise.exercise.guid
                )
                .flatMap(e => e.sets) as WorkoutSet[]
            }
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
