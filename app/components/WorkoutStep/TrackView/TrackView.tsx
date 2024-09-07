import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import StepExerciseForm from './StepExerciseForm'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <View style={{ flex: 1 }}>
      {hasFocusedStep && (
        <StepExerciseForm exercise={stateStore.focusedStep!.exercise} />
      )}
      {!hasFocusedStep && (
        <EmptyState text={translate('selectExerciseForEdit')} />
      )}
    </View>
  )
}

export default observer(TrackView)
