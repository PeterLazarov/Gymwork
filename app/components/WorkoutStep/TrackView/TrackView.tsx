import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import StepExerciseForm from './StepExerciseForm'
import ExerciseControl from '../ExerciseControl'
import { colors } from 'designSystem'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <>
      {hasFocusedStep && (
        <View style={{ flex: 1, backgroundColor: colors.neutralLightest }}>
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
            exercise={stateStore.focusedStepExercise!}
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
