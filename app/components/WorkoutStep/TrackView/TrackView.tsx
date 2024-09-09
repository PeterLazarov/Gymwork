import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import StepExerciseForm from './StepExerciseForm'
import ExerciseControl from '../ExerciseControl'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <>
      {hasFocusedStep && (
        <View style={{ flex: 1 }}>
          {stateStore.focusedStep.type === 'superSet' && (
            <ExerciseControl
              step={stateStore.focusedStep}
              onExerciseChange={index => {
                stateStore.setProp(
                  'focusedExerciseGuid',
                  stateStore.focusedStep?.exercises[index].guid
                )
              }}
            />
          )}
          <StepExerciseForm
            step={stateStore.focusedStep}
            exercise={stateStore.focusedExercise!}
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
