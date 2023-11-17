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
  const { stateStore } = useStores()
  const router = useRouter()

  function handleSelectExercise(exercise: Exercise) {
    stateStore.setOpenedExercise(exercise)
    router.push('/WorkoutExercise')
  }

  function onBackPress() {
    router.push('/')
  }

  function onAddExercisePress() {
    router.push('/ExerciseCreate')
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={texts.selectExercise} />
        <Appbar.Action
          icon={() => (
            <Icon
              icon="add"
              size="large"
            />
          )}
          onPress={onAddExercisePress}
          animated={false}
        />
      </Appbar.Header>

      <ExerciseSelect onSelect={handleSelectExercise} />
    </View>
  )
}
export default observer(ExerciseSelectPage)
