import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon } from '../designSystem'
import texts from '../texts'
import ExerciseSelect from '../components/Exercise/ExerciseSelect'

const ExerciseListPage: React.FC = () => {
  const { exerciseStore, workoutStore } = useStores()
  const router = useRouter()

  function handleSelectExercise(exercise: Exercise) {
    workoutStore.addWorkoutExercise(exercise)
    router.push('/')
  }

  function onBackPress() {
    router.push('/')
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={texts.addExercise} />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={onBackPress}
          animated={false}
        />
      </Appbar.Header>

      <ExerciseSelect onSelect={handleSelectExercise} />
    </View>
  )
}
export default observer(ExerciseListPage)
