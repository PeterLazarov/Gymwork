import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import DayControl from '../components/Workout/DayControl'
import WorkoutControlButtons from '../components/Workout/WorkoutControlButtons'
import WorkoutExerciseList from '../components/Workout/WorkoutExerciseList'
import WorkoutTimer from '../components/WorkoutTimer'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'
import SwipeContainer from '../designSystem/SwipeContainer'
import colors from '../designSystem/colors'

const WorkoutPage: React.FC = () => {
  const { workoutStore, timeStore, stateStore } = useStores()
  const router = useRouter()

  function newWorkout() {
    workoutStore.createWorkout()
  }

  function openCalendar() {
    router.push('/Calendar')
  }

  function onSwipeRight() {
    stateStore.decrementCurrentDate()
  }
  function onSwipeLeft() {
    stateStore.incrementCurrentDate()
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.Action
          icon={() => <Icon icon="logo-react" />}
          animated={false}
        />
        <Appbar.Content
          title="Gymwork"
          style={{ alignItems: 'flex-start' }}
        />

        <Appbar.Action
          icon={() => <Icon icon="md-calendar-sharp" />}
          onPress={openCalendar}
          animated={false}
        />
        {!timeStore.stopwatchRunning && !timeStore.stopwatchPaused && (
          <Appbar.Action
            icon={() => <Icon icon="stopwatch" />}
            onPress={timeStore.startStopwatch}
            animated={false}
          />
        )}
        {timeStore.stopwatchPaused && (
          <Appbar.Action
            icon={() => <Icon icon="play" />}
            onPress={timeStore.startStopwatch}
            animated={false}
          />
        )}
        {timeStore.stopwatchRunning && (
          <Appbar.Action
            icon={() => <Icon icon="pause-outline" />}
            onPress={timeStore.pauseStopwatch}
            animated={false}
          />
        )}
        {(timeStore.stopwatchRunning || timeStore.stopwatchPaused) && (
          <Appbar.Action
            icon={() => <Icon icon="stop" />}
            onPress={timeStore.stopStopwatch}
            animated={false}
          />
        )}
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={() => {}}
          animated={false}
        />
      </Appbar.Header>
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
