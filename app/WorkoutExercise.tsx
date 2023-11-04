import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'
import { useStores } from '../db/helpers/useStores'
import { Icon, IconButtonContainer } from '../designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

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
      <WorkoutExerciseEntry exercise={workoutStore.openedExercise!} />
    </View>
  )
}
export default observer(WorkoutExercisePage)
