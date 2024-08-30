import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { colors } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import EmptyState from '../EmptyState'
import ExerciseRecordsView from './ExerciseRecordsView'

const ExerciseStatsView: React.FC = () => {
  const { stateStore } = useStores()

  return (
    <View style={{ backgroundColor: colors.lightgray, flex: 1 }}>
      {stateStore.focusedStepGuid && <ExerciseRecordsView />}

      {!stateStore.focusedStepGuid && (
        <EmptyState text="Hold touch on exercise to view stats" />
      )}
    </View>
  )
}

export default observer(ExerciseStatsView)
