import React, { useState } from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { useRouteParams } from 'app/navigators'
import { FAB, Header, Icon, IconButton } from 'designSystem'

export type ExerciseSelectScreenParams = {
  selectMode: WorkoutStep['type']
}
export const ExerciseSelectScreen: React.FC = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    stateStore,
    workoutStore,
    navStore: { navigate },
  } = useStores()
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const { selectMode } = useRouteParams('ExerciseSelect')

  function createExercisesStep(exercises: Exercise[]) {
    if (!stateStore.openedWorkout) {
      workoutStore.createWorkout()
    }
    const newStep = stateStore.openedWorkout!.addStep(exercises, selectMode)
    stateStore.setFocusedStep(newStep.guid)
    stateStore.setProp('focusedExerciseGuid', newStep.exercises[0]?.guid)

    navigate('WorkoutStep')
  }

  function onBackPress() {
    navigate('WorkoutStack', { screen: 'Workout' })
  }

  function onAddExercisePress() {
    navigate('ExerciseEdit', {
      createMode: true,
    })
  }

  const supersetTitle =
    selectedExercises.length > 0
      ? translate('selectedCount', { count: selectedExercises.length })
      : translate('selectExercises')

  return (
    <EmptyLayout>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Header>
          <IconButton onPress={onBackPress}>
            <Icon
              icon="chevron-back"
              color={colors.onPrimary}
            />
          </IconButton>
          <Header.Title
            title={
              selectMode === 'straightSet'
                ? translate('selectExercise')
                : supersetTitle
            }
          />
          <IconButton onPress={onAddExercisePress}>
            <Icon
              icon="add"
              size="large"
              color={colors.onPrimary}
            />
          </IconButton>
        </Header>

        <View style={{ flex: 1 }}>
          <ExerciseSelectLists
            multiselect={selectMode === 'superSet'}
            selected={selectedExercises}
            onChange={
              selectMode === 'superSet'
                ? setSelectedExercises
                : createExercisesStep
            }
          />
        </View>
        {selectMode === 'superSet' && (
          <FAB
            icon="check"
            disabled={selectedExercises.length < 2}
            onPress={() => createExercisesStep(selectedExercises)}
          />
        )}
      </View>
    </EmptyLayout>
  )
}
