import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import ExerciseHistoryChart from '../components/ExerciseHistory'
import { Icon } from '../designSystem'
import { observer } from 'mobx-react-lite'
import ExerciseSelect from '../components/Exercise/ExerciseSelect'
import { useState } from 'react'
import { Exercise } from '../db/models'
import texts from '../texts'

const Log = observer(() => {
  const router = useRouter()

  // TODO remove default
  const [exercise, setExercise] = useState<Exercise>()

  function onBackPress() {
    router.push('/')
  }
  return (
    <View
      style={{
        height: '100%',
      }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={exercise?.name ?? texts.addExercise} />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={() => {}}
          animated={false}
        />
      </Appbar.Header>

      {exercise ? (
        <ExerciseHistoryChart
          exerciseID={exercise.guid}
          view="30D"
        />
      ) : (
        <ExerciseSelect onSelect={setExercise} />
      )}
    </View>
  )
})

export default Log
