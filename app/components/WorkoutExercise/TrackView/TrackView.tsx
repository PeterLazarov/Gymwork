import { observer } from 'mobx-react-lite'
import React from 'react'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import StepTrackForm from './StepTrackForm'
import { translate } from 'app/i18n'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <>
      {hasFocusedStep && <StepTrackForm />}
      {!hasFocusedStep && (
        <EmptyState text={translate('selectExerciseForEdit')} />
      )}
    </>
  )
}

export default observer(TrackView)
