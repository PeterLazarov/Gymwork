import React, { useState } from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutStep } from 'app/db/models'
import { navigate, useRouteParams } from 'app/navigators'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import FavoriteExercisesList from 'app/components/Exercise/FavoriteExercisesList'
import AllExercisesList from 'app/components/Exercise/AllExercisesList'
import MostUsedExercisesList from 'app/components/Exercise/MostUsedExercisesList'
import { FAB, Header, Icon, IconButton, SwipeTabs, colors } from 'designSystem'
import { TabConfig } from 'designSystem/Tabs/types'

export type ExerciseSelectScreenParams = {
  selectMode: WorkoutStep['type']
}
const ExerciseSelectScreen: React.FC = () => {
  const { stateStore, workoutStore } = useStores()
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const { selectMode } = useRouteParams('ExerciseSelect')

  function toggleSelectedExercise(exercise: Exercise) {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises(oldVal => {
        const newSelected = [...oldVal, exercise]
        return newSelected
      })
    } else {
      setSelectedExercises(oldVal => {
        const newSelected = oldVal.filter(e => e.guid !== exercise.guid)
        return newSelected
      })
    }
  }

  function createExercisesStep(exercises: Exercise[]) {
    if (!stateStore.openedWorkout) {
      workoutStore.createWorkout()
    }
    const newStep = stateStore.openedWorkout!.addStep(exercises, selectMode)
    stateStore.setFocusedStep(newStep.guid)
    navigate('Workout')
  }

  function onBackPress() {
    navigate('Workout')
  }

  function onAddExercisePress() {
    navigate('ExerciseEdit', {
      createMode: true,
    })
  }

  const props = {
    onSelect:
      selectMode === 'superSet'
        ? toggleSelectedExercise
        : (exercise: Exercise) => createExercisesStep([exercise]),
    selectedExercises,
  }
  const tabsConfig: TabConfig<typeof props>[] = [
    {
      label: translate('favorite'),
      name: 'tabFavorite',
      component: FavoriteExercisesList,
      props,
    },
    {
      label: translate('mostUsed'),
      name: 'tabMostUsed',
      component: MostUsedExercisesList,
      props,
    },
    {
      label: translate('allExercises'),
      name: 'tabAll',
      component: AllExercisesList,
      props,
    },
  ]

  return (
    <EmptyLayout>
      <View style={{ flex: 1, alignItems: 'center' }}>
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
        {selectedExercises.length > 0 && (
          <FAB
            icon="check"
            onPress={() => createExercisesStep(selectedExercises)}
          />
        )}
      </View>
    </EmptyLayout>
  )
}
export default ExerciseSelectScreen
