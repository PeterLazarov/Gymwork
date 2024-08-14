import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Dimensions } from 'react-native'

import WorkoutExerciseHistoryList from './WorkoutExerciseHistoryList'
import { useStores } from '../../../app/db/helpers/useStores'
import ExerciseHistoryChart from '../../ExerciseHistoryChart'

const padding = 16

type Props = {
  graphHidden: boolean
}
const WorkoutExerciseHistoryView: React.FC<Props> = ({ graphHidden }) => {
  const { workoutStore, stateStore } = useStores()

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
          exerciseID={stateStore.openedExerciseGuid}
          height={250}
          width={Dimensions.get('window').width - padding * 2}
        />
      )}
      <WorkoutExerciseHistoryList
        workouts={workoutStore.exerciseWorkouts[stateStore.openedExerciseGuid]}
      />
    </View>
  )
}

export default observer(WorkoutExerciseHistoryView)
