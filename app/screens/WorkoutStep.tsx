import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import ExerciseTrackView from 'app/components/WorkoutStep/ExerciseTrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import ExerciseControl from 'app/components/WorkoutStep/ExerciseControl'
import { TabsLayout } from 'app/layouts/TabsLayout'

const WorkoutStepScreen: React.FC = () => {
  const { stateStore } = useStores()

  return (
    <>
      <StepHeader />
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
    </>
  )
}
export default observer(WorkoutStepScreen)
