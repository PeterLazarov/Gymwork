import React, { useState } from 'react'
import { Alert, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { useRouteParams } from 'app/navigators'
import { FAB, Header, Icon, IconButton } from 'designSystem'
import { Screen } from '@/components/ignite'

export type ExerciseSelectScreenParams = {
  selectMode: WorkoutStep['type']
  onSelect?: (exercises: Exercise[]) => void
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

  const { selectMode, onSelect } = useRouteParams('ExerciseSelect')

  // function createExercisesStep(exercises: Exercise[]) {
  //   if (!stateStore.openedWorkout) {
  //     workoutStore.createWorkout()
  //   }
  //   const newStep = stateStore.openedWorkout!.addStep(exercises, selectMode)
  //   stateStore.setFocusedStep(newStep.guid)
  //   stateStore.setProp('focusedExerciseGuid', newStep.exercises[0]?.guid)

  //   navigate('WorkoutStep')
  // }

  // TODO remove?
  // function onBackPress() {
  //   navigate('WorkoutStack', { screen: 'Workout' })
  // }

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
    <Screen contentContainerStyle={{ flex: 1 }}>
      {/* <View style={{ flex: 1, alignItems: 'center' }}> */}
      <Header>
        <IconButton onPress={onAddExercisePress}>
          <Icon
            icon="add"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>
      <Header.Title
        title={
          selectMode === 'straightSet'
            ? translate('selectExercise')
            : supersetTitle
        }
      />

      <View style={{ flex: 1 }}>
        <ExerciseSelectLists
          multiselect={selectMode === 'superSet'}
          selected={selectedExercises}
          onChange={
            // selectMode === 'superSet'
            //   ? setSelectedExercises
            //   : createExercisesStep
            exercises => {
              setSelectedExercises(exercises)
              onSelect?.(exercises)
            }
          }
        />
      </View>
      {selectMode === 'superSet' && (
        <FAB
          icon="check"
          disabled={selectedExercises.length < 2}
          onPress={() => {
            Alert.alert('not implemented')
            // createExercisesStep(selectedExercises)
          }}
        />
      )}
      {/* </View> */}
    </Screen>
  )
}
