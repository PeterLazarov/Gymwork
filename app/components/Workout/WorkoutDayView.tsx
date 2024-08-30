import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { colors } from 'designSystem'
import WorkoutStepList from './WorkoutStepList'
import DayControl from './DayControl'
import WorkoutControlButtons from './WorkoutControlButtons'

const WorkoutDayView: React.FC = () => {
  const { stateStore } = useStores()
  const workout = stateStore.openedWorkout

  return (
    <>
      <DayControl />
      <View style={{ backgroundColor: colors.lightgray, flex: 1 }}>
        {workout ? (
          <WorkoutStepList workout={workout} />
        ) : (
          <EmptyState
            text={translate('workoutLogEmpty') + stateStore.openedDate}
          />
        )}
      </View>
      <WorkoutControlButtons />
    </>
  )
}

export default observer(WorkoutDayView)
