import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import ExerciseTrackView from 'app/components/WorkoutStep/ExerciseTrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import ExerciseControl from 'app/components/WorkoutStep/ExerciseControl'

const WorkoutStepScreen: React.FC = () => {
  const { stateStore } = useStores()

  return (
    <EmptyLayout>
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
    </EmptyLayout>
  )
}
export default observer(WorkoutStepScreen)
