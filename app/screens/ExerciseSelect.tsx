import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import AllExerciseSelect from '../components/Exercise/AllExerciseSelect'
import FavoriteExerciseSelect from '../components/Exercise/FavoriteExerciseSelect'
import { useStores } from '../db/helpers/useStores'
import { Exercise } from '../db/models'
import { Icon } from '../../designSystem'
import SwipeTabs from '../../designSystem/SwipeTabs'
import colors from '../../designSystem/colors'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'

const ExerciseSelectPage: React.FC = () => {
  const { stateStore } = useStores()

  function handleSelectExercise(exercise: Exercise) {
    stateStore.setOpenedExercise(exercise)
    navigate('ExerciseSelect')
  }

  function onBackPress() {
    navigate('Workout')
  }

  function onAddExercisePress() {
    navigate('ExerciseCreate')
  }

  const tabsConfig = [
    {
      label: 'Most used',
      name: 'tabFavorite',
      component: FavoriteExerciseSelect,
      props: { onSelect: handleSelectExercise },
    },
    {
      label: 'All exercises',
      name: 'tabAll',
      component: AllExerciseSelect,
      props: { onSelect: handleSelectExercise },
    },
  ]
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={translate('selectExercise')} />
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

      <SwipeTabs tabsConfig={tabsConfig} />
    </View>
  )
}
export default observer(ExerciseSelectPage)
