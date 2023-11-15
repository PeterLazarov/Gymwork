import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Dimensions } from 'react-native'

import WorkoutExerciseHistoryList from './WorkoutExerciseHistoryList'
import { useStores } from '../../../db/helpers/useStores'
import ExerciseHistoryChart from '../../ExerciseHistoryChart'

const padding = 16

type Props = {
  graphHidden: boolean
}
const WorkoutExerciseHistoryView: React.FC<Props> = ({ graphHidden }) => {
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
      {!graphHidden && (
        <ExerciseHistoryChart
          view="ALL"
          exerciseID={workoutStore.openedExerciseGuid}
          height={250}
          width={Dimensions.get('window').width - padding * 2}
        />
      )}
      <WorkoutExerciseHistoryList
        workouts={
          workoutStore.exerciseWorkouts[workoutStore.openedExerciseGuid]
        }
      />
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
