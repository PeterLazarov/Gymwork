import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import ExerciseTrackView from 'app/components/WorkoutStep/ExerciseTrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import ExerciseControl from 'app/components/WorkoutStep/ExerciseControl'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import { Exercise } from 'app/db/models'

export const WorkoutStepScreen: React.FC = observer(() => {
  const { stateStore, navStore } = useStores()

  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)

  if (!stateStore.focusedStep || !stateStore.focusedExercise) {
    console.warn('REDIRECT - No step or exercise')
    navStore.navigate('Workout')
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
      <View style={{ flex: 1 }}>
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
      </View>
    )
  )
})
