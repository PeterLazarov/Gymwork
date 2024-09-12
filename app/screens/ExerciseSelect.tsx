import React, { useState } from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutStep } from 'app/db/models'
import { navigate, useRouteParams } from 'app/navigators'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { FAB, Header, Icon, IconButton, colors } from 'designSystem'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'

export type ExerciseSelectScreenParams = {
  selectMode: WorkoutStep['type']
}
const ExerciseSelectScreen: React.FC = () => {
  const { stateStore, workoutStore } = useStores()
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const { selectMode } = useRouteParams('ExerciseSelect')

  function createExercisesStep(exercises: Exercise[]) {
    if (!stateStore.openedWorkout) {
      workoutStore.createWorkout()
    }
    const newStep = stateStore.openedWorkout!.addStep(exercises, selectMode)
    stateStore.setFocusedStep(newStep.guid)
    stateStore.setProp('focusedExerciseGuid', newStep.exercises[0]?.guid)

    stateStore.setProp('homepageTabIndex', 1)
    navigate('WorkoutStep')
  }

  function onBackPress() {
    navigate('WorkoutDay')
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
          <IconButton
            onPress={onBackPress}
            underlay="darker"
          >
            <Icon
              icon="chevron-back"
              color={colors.primaryText}
            />
          </IconButton>
          <Header.Title
            title={
              selectMode === 'straightSet'
                ? translate('selectExercise')
                : supersetTitle
            }
          />
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

        <ExerciseSelectLists
          multiselect={selectMode === 'superSet'}
          selected={selectedExercises}
          onChange={
            selectMode === 'superSet'
              ? setSelectedExercises
              : createExercisesStep
          }
        />

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
export default ExerciseSelectScreen
