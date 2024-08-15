import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import AllExerciseSelect from 'app/components/Exercise/AllExerciseSelect'
import FavoriteExerciseSelect from 'app/components/Exercise/FavoriteExerciseSelect'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { Icon, SwipeTabs, colors } from 'designSystem'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'

const ExerciseSelectPage: React.FC = () => {
  const { stateStore } = useStores()

  function handleSelectExercise(exercise: Exercise) {
    stateStore.setOpenedExercise(exercise)
    navigate('WorkoutExercise')
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
    <EmptyLayout>
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
    </EmptyLayout>
  )
}
export default observer(ExerciseSelectPage)