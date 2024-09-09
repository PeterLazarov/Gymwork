import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { Tabs } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import EmptyState from '../EmptyState'
import ExerciseRecordStats from './ExerciseRecordStats'
import ExerciseHistoryStats from './ExerciseHistoryStats'
import ExerciseChartStats from './ExerciseChartStats'
import ExerciseControl from '../WorkoutStep/ExerciseControl'

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
          <Tabs tabsConfig={tabs} />
        </View>
      )}

      {!hasFocusedStep && (
        <EmptyState text={translate('selectExerciseForStats')} />
      )}
    </>
  )
}

export default observer(ExerciseStatsView)
