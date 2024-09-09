import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import StepExerciseForm from './StepExerciseForm'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <>
      {hasFocusedStep && (
        <View style={{ flex: 1 }}>
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
