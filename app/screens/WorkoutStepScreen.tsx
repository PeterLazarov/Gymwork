import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'

// import { TabHeightCompensation } from '@/navigators/constants'
import { Screen } from '@/components/ignite'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseControl from 'app/components/WorkoutStep/ExerciseControl'
import ExerciseTrackView from 'app/components/WorkoutStep/ExerciseTrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, Workout, WorkoutStep } from 'app/db/models'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export type WorkoutStepScreenProps = StaticScreenProps<{
  // workoutId: Workout['guid']
  // stepId: WorkoutStep['guid']
}>

export const WorkoutStepScreen: React.FC<WorkoutStepScreenProps> = observer(
  props => {
    const { stateStore, navStore } = useStores()

    const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)

    // const nav = useNavigation()
    // nav.setOptions({
    //   headerTitle: 'qwe',
    // } as NativeStackNavigationOptions)

    if (!stateStore.focusedStep || !stateStore.focusedExercise) {
      console.warn('REDIRECT - No step or exercise')
      navStore.navigate('WorkoutStack', { screen: 'Workout' })
      return null
    }

    function switchExercise(exercise: Exercise) {
      if (stateStore.focusedStep && stateStore.focusedExercise) {
        stateStore.focusedStep.switchExercise(
          exercise,
          stateStore.focusedExercise
        )
        stateStore.setProp('focusedExerciseGuid', exercise.guid)
        setExerciseSelectOpen(false)
      }
    }

    return (
      stateStore.focusedStep && (
        <Screen
          safeAreaEdges={['bottom']}
          contentContainerStyle={{
            flex: 1,
            paddingBottom: 16, // TODO this should not be needed
          }}
        >
          <StepHeader
            step={stateStore.focusedStep}
            onSwitchExercise={() => setExerciseSelectOpen(true)}
          />

          {exerciseSelectOpen && (
            <ExerciseSelectLists
              multiselect={false}
              selected={[]}
              onChange={([e]) => {
                if (e) {
                  switchExercise(e)
                }
              }}
            />
          )}

          {!exerciseSelectOpen && (
            <>
              {stateStore.focusedStep?.type === 'superSet' && (
                <ExerciseControl
                  selectedIndex={
                    stateStore.focusedExercise
                      ? stateStore.focusedStep.exercises.indexOf(
                          stateStore.focusedExercise
                        )
                      : -1
                  }
                  options={stateStore.focusedStep.exercises}
                  onChange={({ guid }) => {
                    stateStore.setProp('focusedExerciseGuid', guid)
                  }}
                />
              )}
              <ExerciseTrackView
                exercise={stateStore.focusedExercise}
                step={stateStore.focusedStep}
              />
            </>
          )}
        </Screen>
      )
    )
  }
)
