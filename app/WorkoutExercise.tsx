import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Appbar, SegmentedButtons } from 'react-native-paper'

import WorkoutExerciseHistoryView from '../components/WorkoutExercise/WorkoutExerciseHistoryView'
import WorkoutExerciseRecordsView from '../components/WorkoutExercise/WorkoutExerciseRecordsView'
import WorkoutExerciseTrackView from '../components/WorkoutExercise/WorkoutExerciseTrackView'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  const [view, setView] = useState('track')
  function onOptionsPress() {
    throw new Error('Function not implemented.')
  }

  function onBackPress() {
    router.push('/')
    workoutStore.setOpenedWorkoutExercise(null)
  }

  return (
    <View
      style={{
        // display: 'flex',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
      }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content
          title={workoutStore.openedWorkoutExercise?.exercise.name}
        />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={onOptionsPress}
          animated={false}
        />
      </Appbar.Header>
      <SegmentedButtons
        value={view}
        onValueChange={setView}
        style={{ marginHorizontal: 16 }}
        buttons={[
          {
            value: 'track',
            label: 'Track',
          },
          {
            value: 'history',
            label: 'History',
          },
          { value: 'records', label: 'Records' },
        ]}
      />
      <View
        style={{
          flexGrow: 1,
        }}
      >
        {view === 'track' && <WorkoutExerciseTrackView />}
        {view === 'history' && <WorkoutExerciseHistoryView />}
        {view === 'records' && <WorkoutExerciseRecordsView />}
      </View>
    </View>
  )
}
export default observer(WorkoutExercisePage)
