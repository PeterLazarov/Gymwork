import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import DayControl from '../components/Workout/DayControl'
import WorkoutControlButtons from '../components/Workout/WorkoutControlButtons'
import WorkoutExerciseList from '../components/Workout/WorkoutExerciseList'
import WorkoutHeader from '../components/Workout/WorkoutHeader'
import Timer from '../components/Timer/Timer'
import { useStores } from '../db/helpers/useStores'
import SwipeContainer from '../designSystem/SwipeContainer'
import WorkoutHorizontalList from '../components/Workout/WorkoutHorizontalList'
import Timer2 from '../components/Timer/Timer2'

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
          <Timer />
        )}
        <Timer2 />
        <WorkoutHorizontalList />
        <WorkoutControlButtons createWorkout={newWorkout} />
      </SwipeContainer>
    </View>
  )
}
export default observer(WorkoutPage)
