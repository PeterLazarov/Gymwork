import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'

import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'
import WorkoutExerciseHistory from '../components/WorkoutExerciseHistory'
import WorkoutExerciseRecords from '../components/WorkoutExerciseRecords'
import { useStores } from '../db/helpers/useStores'
import { Icon, IconButtonContainer } from '../designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  const [view, setView] = useState('track')
  function onOptionsPress() {
    throw new Error('Function not implemented.')
  }

  function onBackPress() {
    router.push('/')
    workoutStore.setOpenedExercise(null)
  }

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButtonContainer onPress={onBackPress}>
          <Icon icon="chevron-back" />
        </IconButtonContainer>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            flex: 1,
          }}
        >
          {workoutStore.openedExercise?.exercise.name}
        </Text>

        <IconButtonContainer onPress={onOptionsPress}>
          <Icon icon="ellipsis-vertical" />
        </IconButtonContainer>
      </View>
      <SegmentedButtons
        value={view}
        onValueChange={setView}
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
      {view === 'track' && <WorkoutExerciseEntry />}
      {view === 'history' && <WorkoutExerciseHistory />}
      {view === 'records' && <WorkoutExerciseRecords />}
    </View>
  )
}
export default observer(WorkoutExercisePage)
