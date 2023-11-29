import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import DayControl from '../components/Workout/DayControl'
import WorkoutControlButtons from '../components/Workout/WorkoutControlButtons'
import WorkoutExerciseList from '../components/Workout/WorkoutExerciseList'
import WorkoutHeader from '../components/Workout/WorkoutHeader'
import WorkoutTimer from '../components/WorkoutTimer'
import { useStores } from '../db/helpers/useStores'
import SwipeContainer from '../designSystem/SwipeContainer'

const WorkoutPage: React.FC = () => {
  const { workoutStore, timeStore, stateStore } = useStores()

  function newWorkout() {
    workoutStore.createWorkout()
  }

  function onSwipeRight() {
    stateStore.decrementCurrentDate()
  }
  function onSwipeLeft() {
    stateStore.incrementCurrentDate()
  }

  return (
    <View style={{ flex: 1 }}>
      <WorkoutHeader />
      <SwipeContainer
        onSwipeRight={onSwipeRight}
        onSwipeLeft={onSwipeLeft}
      >
        <DayControl />
        {timeStore.stopwatchValue !== '' && stateStore.isOpenedWorkoutToday && (
          <WorkoutTimer />
        )}
        <WorkoutExerciseList />
        <WorkoutControlButtons createWorkout={newWorkout} />
      </SwipeContainer>
    </View>
  )
}
export default observer(WorkoutPage)
