import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import StepTrackForm from './StepTrackForm'
import EmptyState from 'app/components/EmptyState'

const TrackView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  return (
    <>
      {hasFocusedStep && <StepTrackForm />}
      {!hasFocusedStep && (
        <EmptyState text="Select exercise to log your work" />
      )}
    </>
  )
}

export default observer(TrackView)
