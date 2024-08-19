import { Link } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import ExerciseList from 'app/components/Exercise/ExerciseList'
import ExerciseHistoryChart from 'app/components/ExerciseHistoryChart'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { Header, Icon, IconButton, colors } from 'designSystem'
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
      <Header>
        <Link to={{ screen: 'Workout' }}>
          <IconButton underlay="darker">
            <Icon
              icon="chevron-back"
              color={colors.primaryText}
            />
          </IconButton>
        </Link>
        <Header.Title title={exercise?.name ?? translate('addExercise')} />
        <IconButton
          onPress={() => {}}
          underlay="darker"
        >
          <Icon
            icon="ellipsis-vertical"
            color={colors.primaryText}
          />
        </IconButton>
      </Header>

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
