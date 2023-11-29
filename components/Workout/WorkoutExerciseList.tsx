import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView } from 'react-native'

import { useStores } from '../../db/helpers/useStores'
import WorkoutExerciseCard from '../WorkoutExercise/WorkoutExerciseCard'

const WorkoutExerciseList: React.FC = () => {
  const { stateStore, openedWorkoutExercises } = useStores()

  return (
    <ScrollView style={{ flex: 1 }}>
      {stateStore.openedWorkout &&
        openedWorkoutExercises.map(exercise => (
          <WorkoutExerciseCard
            key={`${stateStore.openedWorkout!.date}_${exercise.guid}`}
            workout={stateStore.openedWorkout!}
            exercise={exercise}
          />
        ))}
    </ScrollView>
  )
}
export default observer(WorkoutExerciseList)
