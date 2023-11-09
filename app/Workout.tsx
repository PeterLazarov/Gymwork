import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar } from 'react-native-paper'

import DayControl from '../components/DayControl'
import WorkoutControlButtons from '../components/WorkoutControlButtons'
import WorkoutExerciseCard from '../components/WorkoutExercise/WorkoutExerciseCard'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'

const WorkoutPage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  function newWorkout() {
    workoutStore.createWorkout()
  }

  function openCalendar() {
    router.push('/Calendar')
  }
  function openLogs() {
    router.push('/Log')
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
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
        <Appbar.Action
          icon={() => <Icon icon="analytics" />}
          onPress={openLogs}
          animated={false}
        />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={() => {}}
          animated={false}
        />
      </Appbar.Header>
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
