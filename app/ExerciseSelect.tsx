import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import ExerciseSelect from '../components/Exercise/ExerciseSelect'
import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon } from '../designSystem'
import texts from '../texts'

const ExerciseSelectPage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  function handleSelectExercise(exercise: Exercise) {
    workoutStore.setOpenedExercise(exercise)
    router.push('/WorkoutExercise')
  }

  function onBackPress() {
    router.push('/')
  }

  function onAddExercisePress() {
    // TODO: Implement exercise create
    router.push('/')
  }
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={texts.addExercise} />
        <Appbar.Action
          icon={() => <Icon icon="add" />}
          onPress={onAddExercisePress}
          animated={false}
        />
      </Appbar.Header>

      <ExerciseSelect onSelect={handleSelectExercise} />
    </View>
  )
}
export default observer(ExerciseSelectPage)
