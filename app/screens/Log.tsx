import { Link } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Appbar } from 'react-native-paper'

import ExerciseList from 'app/components/Exercise/ExerciseList'
import ExerciseHistoryChart from 'app/components/ExerciseHistoryChart'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { Icon, colors } from 'designSystem'
import { translate } from 'app/i18n'

// TODO: screen is unused - remove?
const Log = observer(() => {
  const { exercisesPerformed } = useStores()

  // TODO remove default
  const [exercise, setExercise] = useState<Exercise>()

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: colors.secondary,
      }}
    >
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Link to={{ screen: 'Workout' }}>
          <Appbar.BackAction />
        </Link>
        <Appbar.Content title={exercise?.name ?? translate('addExercise')} />
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
