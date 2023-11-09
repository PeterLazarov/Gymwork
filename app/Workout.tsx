import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView, View } from 'react-native'

import DayControl from '../components/DayControl'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseCard from '../components/WorkoutExercise/WorkoutExerciseCard'
import { useStores } from '../db/helpers/useStores'

const WorkoutPage: React.FC = () => {
  const { workoutStore } = useStores()

  function newWorkout() {
    workoutStore.createWorkout()
  }

  return (
    <View style={{ flex: 1 }}>
      <DayControl />

      <ScrollView style={{ flex: 1 }}>
        {workoutStore.currentWorkout?.exercises.map(exercise => (
          <WorkoutExerciseCard
            key={`${workoutStore.currentWorkout.date}_${exercise.guid}`}
            exercise={exercise}
          />
        ))}
      </ScrollView>
      <WorkoutControlButtons
        isWorkoutStarted={!!workoutStore.currentWorkout}
        createWorkout={newWorkout}
      />
    </View>
  )
}
export default observer(WorkoutPage)
