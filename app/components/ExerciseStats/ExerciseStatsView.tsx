import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { Tabs, colors } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import EmptyState from '../EmptyState'
import ExerciseRecordStats from './ExerciseRecordStats'
import ExerciseHistoryStats from './ExerciseHistoryStats'
import { translate } from 'app/i18n'
import ExerciseChartStats from './ExerciseChartStats'

const ExerciseStatsView: React.FC = () => {
  const { stateStore } = useStores()

  const hasFocusedStep = !!stateStore.focusedStep

  const tabs = [
    {
      name: 'records',
      label: translate('records'),
      component: ExerciseRecordStats,
    },
    {
      name: 'history',
      label: translate('history'),
      component: ExerciseHistoryStats,
    },
    {
      name: 'chart',
      label: translate('chart'),
      component: ExerciseChartStats,
    },
  ]

  return (
    <View style={{ backgroundColor: colors.lightgray, flex: 1 }}>
      {hasFocusedStep && <Tabs tabsConfig={tabs} />}

      {!hasFocusedStep && (
        <EmptyState text="Hold touch on exercise to view stats" />
      )}
    </View>
  )
}

export default observer(ExerciseStatsView)
