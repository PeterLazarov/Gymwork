import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import ExerciseHistory from '../components/ExerciseHistory'
import { exercises } from '../data/exercises.json'
import { Icon } from '../designSystem'

export default function Log() {
  const router = useRouter()

  const exercise = exercises[43]

  function onBackPress() {
    router.push('/')
  }
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={exercise.name} />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={() => {}}
          animated={false}
        />
      </Appbar.Header>

      <ExerciseHistory exercise={exercise} />
    </View>
  )
}
