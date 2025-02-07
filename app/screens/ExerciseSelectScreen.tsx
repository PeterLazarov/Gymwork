import type { StaticScreenProps } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert, View } from 'react-native'

import { Screen } from '@/components/ignite'
import { useAppTheme } from '@/utils/useAppTheme'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutStep } from 'app/db/models'
import { translate } from 'app/i18n'
import { FAB, HeaderRight, HeaderTitle, Icon, IconButton } from 'designSystem'

export type ExerciseSelectScreenProps = StaticScreenProps<{
  selectMode: WorkoutStep['type']
  onSelect?: (exercises: Exercise[]) => void
}>

export const ExerciseSelectScreen: React.FC<ExerciseSelectScreenProps> = ({
  route: { params },
}) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    stateStore,
    workoutStore,
    navStore: { navigate },
  } = useStores()
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const { selectMode, onSelect } = params

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
      <HeaderRight>
        <IconButton onPress={onAddExercisePress}>
          <Icon
            icon="add"
            color={colors.onPrimary}
          />
        </IconButton>
      </HeaderRight>
      <HeaderTitle
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
              console.log({ onSelect, exercises })
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
