import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView, View } from 'react-native'

import DayControl from '../components/DayControl'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseListItem from '../components/WorkoutExerciseListItem'
import { Exercise } from '../models/Exercise'
import { useStores } from '../models/helpers/useStores'

const WorkoutPage: React.FC = () => {
  const { workoutStore } = useStores()

  function newWorkout() {
    workoutStore.createWorkout()
  }

  async function addExercise(exercise: Exercise) {
    workoutStore.addWorkoutExercise(exercise)
  }

  return (
    <View>
      <DayControl />

      <ScrollView>
        {workoutStore.currentWorkout?.exercises.map((exercise, i) => (
          <WorkoutExerciseListItem
            key={`${workoutStore.currentWorkout.date}_${i}`}
            exercise={exercise}
          />
        ))}
      </ScrollView>

      <WorkoutControlButtons
        isWorkoutStarted={!!workoutStore.currentWorkout}
        createWorkout={newWorkout}
        addExercise={addExercise}
      />
    </View>
  )
}
export default observer(WorkoutPage)
