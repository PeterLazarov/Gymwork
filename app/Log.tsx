import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import ExerciseHistoryChart from '../components/ExerciseHistory'
import { Icon } from '../designSystem'
import { useStores } from '../db/helpers/useStores'
import { observer } from 'mobx-react-lite'

const Log = observer(() => {
  const router = useRouter()
  const { exerciseStore } = useStores()

  // TODO
  const exercise = exerciseStore.exercises[43]

  function onBackPress() {
    router.push('/')
  }
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        {exercise && <Appbar.Content title={exercise.name} />}
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={() => {}}
          animated={false}
        />
      </Appbar.Header>

      {exercise && (
        <ExerciseHistoryChart
          exerciseID={exercise.guid}
          view="30D"
        />
      )}
    </View>
  )
})

export default Log
