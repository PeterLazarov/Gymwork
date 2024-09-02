import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import FavoriteExercisesList from 'app/components/Exercise/FavoriteExercisesList'
import AllExercisesList from 'app/components/Exercise/AllExercisesList'
import MostUsedExercisesList from 'app/components/Exercise/MostUsedExercisesList'
import { Header, Icon, IconButton, SwipeTabs, colors } from 'designSystem'
import { TabConfig } from 'designSystem/Tabs/types'

const ExerciseSelectScreen: React.FC = () => {
  const { stateStore } = useStores()

  function handleSelectExercise(exercise: Exercise) {
    const newStep = stateStore.openedWorkout!.addStep(exercise)
    stateStore.setFocusedStep(newStep.guid)
    navigate('Workout')
  }

  function onBackPress() {
    navigate('Workout')
  }

  function onAddExercisePress() {
    navigate('ExerciseCreate')
  }

  type ItemProps = { onSelect: (exercise: Exercise) => void }
  const tabsConfig: TabConfig<ItemProps>[] = [
    {
      label: translate('favorite'),
      name: 'tabFavorite',
      component: FavoriteExercisesList,
      props: { onSelect: handleSelectExercise },
    },
    {
      label: translate('mostUsed'),
      name: 'tabMostUsed',
      component: MostUsedExercisesList,
      props: { onSelect: handleSelectExercise },
    },
    {
      label: translate('allExercises'),
      name: 'tabAll',
      component: AllExercisesList,
      props: { onSelect: handleSelectExercise },
    },
  ]
  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.primaryText}
          />
        </IconButton>
        <Header.Title title={translate('selectExercise')} />
        <IconButton
          onPress={onAddExercisePress}
          underlay="darker"
        >
          <Icon
            icon="add"
            size="large"
            color={colors.primaryText}
          />
        </IconButton>
      </Header>

      <SwipeTabs tabsConfig={tabsConfig} />
    </EmptyLayout>
  )
}
export default observer(ExerciseSelectScreen)
