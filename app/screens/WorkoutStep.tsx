import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { BottomNavigation } from 'react-native-paper'

import { Icon, boxShadows, colors } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import ExerciseTrackView from 'app/components/WorkoutStep/ExerciseTrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
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
    chart: () => <ExerciseChartStats exercise={stateStore.focusedExercise} />,
    records: () => (
      <ExerciseRecordStats exercise={stateStore.focusedExercise} />
    ),
    history: () => (
      <ExerciseHistoryStats exercise={stateStore.focusedExercise} />
    ),
    track: () => (
      <ExerciseTrackView
        exercise={stateStore.focusedExercise!}
        step={stateStore.focusedStep!}
      />
    ),
  })

  return (
    <EmptyLayout>
      <StepHeader />
      {stateStore.focusedStep?.type === 'superSet' && (
        <ExerciseControl
          selectedIndex={stateStore.focusedStep.exercises.indexOf(
            stateStore.focusedExercise!
          )}
          options={stateStore.focusedStep.exercises}
          onChange={({ guid }) => {
            stateStore.setProp('focusedExerciseGuid', guid)
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
