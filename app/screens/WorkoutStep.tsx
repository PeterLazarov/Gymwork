import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import ExerciseTrackView from 'app/components/WorkoutStep/ExerciseTrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import ExerciseControl from 'app/components/WorkoutStep/ExerciseControl'
import { View } from 'react-native'

const WorkoutStepScreen: React.FC = () => {
  const { stateStore,navStore } = useStores()

  if (!stateStore.focusedStep) {
    navStore.navigate('Workout')
  }

  return (
    <View style={{ marginBottom: 8, flex: 1 }}>
      {stateStore.focusedStep && (

        <StepHeader step={ stateStore.focusedStep} />
      
      {stateStore.focusedStep?.type === 'superSet' && (
        <ExerciseControl
          selectedIndex={stateStore.focusedStep.exercises.indexOf(
            stateStore.focusedExercise!
          )}
          options={stateStore.focusedStep.exercises}
          onChange={({ guid }) => {
            stateStore.setProp('focusedExerciseGuid', guid)
          }}
        />
      )}
      <ExerciseTrackView
        exercise={stateStore.focusedExercise!}
        step={stateStore.focusedStep!}
      />
    )}
    </View>
  )
}
export default observer(WorkoutStepScreen)
