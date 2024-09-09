import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import TrackView from 'app/components/WorkoutStep/TrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import { Icon, boxShadows, colors } from 'designSystem'
import { BottomNavigation } from 'react-native-paper'
import { useStores } from 'app/db/helpers/useStores'
import ExerciseControl from 'app/components/WorkoutStep/ExerciseControl'
import ExerciseHistoryStats from 'app/components/ExerciseStats/ExerciseHistoryStats'
import ExerciseRecordStats from 'app/components/ExerciseStats/ExerciseRecordStats'
import ExerciseChartStats from 'app/components/ExerciseStats/ExerciseChartStats'

const WorkoutStepScreen: React.FC = () => {
  const { stateStore } = useStores()
  const [index, setIndex] = useState(3)

  const routes = useMemo(
    () => [
      {
        key: 'chart',
        title: 'Chart',
        focusedIcon: () => <Icon icon="analytics" />,
      },
      {
        key: 'records',
        title: 'Records',
        focusedIcon: () => <Icon icon="trophy" />,
      },
      {
        key: 'history',
        title: 'History',
        focusedIcon: () => <Icon icon="history" />,
      },
      {
        key: 'track',
        title: 'Track',
        focusedIcon: () => <Icon icon="clipboard-plus-outline" />,
      },
    ],
    []
  )
  const renderScene = BottomNavigation.SceneMap({
    chart: ExerciseChartStats,
    records: ExerciseRecordStats,
    history: ExerciseHistoryStats,
    track: TrackView,
  })

  return (
    <EmptyLayout>
      <StepHeader />
      {stateStore.focusedStep?.type === 'superSet' && (
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
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          backgroundColor: colors.neutralLightest,
          ...boxShadows.lg,
        }}
        activeIndicatorStyle={{ backgroundColor: colors.primaryLight }}
      />
    </EmptyLayout>
  )
}
export default observer(WorkoutStepScreen)
