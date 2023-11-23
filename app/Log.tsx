import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar } from 'react-native-paper'

import ExerciseList from '../components/Exercise/ExerciseList'
import ExerciseHistoryChart from '../components/ExerciseHistoryChart'
import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon } from '../designSystem'
import colors from '../designSystem/colors'
import texts from '../texts'

// TODO: screen is unused - remove?
const Log = observer(() => {
  const router = useRouter()
  const { exercisesPerformed } = useStores()

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
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
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
        <ScrollView>
          {/* TODO add a number at the end for dates performed? */}
          <ExerciseList
            exercises={exercisesPerformed}
            onSelect={setExercise}
          />
        </ScrollView>
      )}
    </View>
  )
})

export default Log
