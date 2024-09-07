import React from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import StepExerciseForm from './StepExerciseForm'
import ExerciseControl from '../ExerciseControl'
import { observer } from 'mobx-react-lite'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  const exercise =
    stateStore.focusedStep?.type === 'straightSet'
      ? stateStore.focusedStep.exercise
      : stateStore.supersetStepOpenedExercise

  return (
    <>
      {hasFocusedStep && (
        <View style={{ flex: 1 }}>
          {stateStore.focusedStep.type === 'superSet' && (
            <ExerciseControl
              step={stateStore.focusedStep}
              onExerciseChange={index => {
                stateStore.setProp('supersetStepopenedExerciseIndex', index)
              }}
            />
          )}
          <StepExerciseForm
            step={stateStore.focusedStep}
            exercise={exercise!}
          />
        </View>
      )}
      {!hasFocusedStep && (
        <EmptyState text={translate('selectExerciseForEdit')} />
      )}
    </>
  )
}

export default observer(TrackView)
