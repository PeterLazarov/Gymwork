import { observer } from 'mobx-react-lite'
import React from 'react'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import StepTrackForm from './StepTrackForm'
import { translate } from 'app/i18n'
import { colors } from 'designSystem'
import { View } from 'react-native'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <View style={{ backgroundColor: colors.lightgray, flex: 1 }}>
      {hasFocusedStep && <StepTrackForm />}
      {!hasFocusedStep && (
        <EmptyState text={translate('selectExerciseForEdit')} />
      )}
    </View>
  )
}

export default observer(TrackView)
