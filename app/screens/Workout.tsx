import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import DayControl from 'app/components/Workout/DayControl'
import WorkoutControlButtons from 'app/components/Workout/WorkoutControlButtons'
import WorkoutExerciseList from 'app/components/Workout/WorkoutExerciseList'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import Timer from 'app/components/Timer/Timer'
import Timer2 from 'app/components/Timer/Timer2'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import { useStores } from 'app/db/helpers/useStores'
import { SwipeContainer } from 'designSystem'

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
