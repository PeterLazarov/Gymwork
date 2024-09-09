import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutExerciseStatsView from 'app/components/ExerciseStats/ExerciseStatsView'
import TrackView from 'app/components/WorkoutStep/TrackView'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import { Icon, boxShadows, colors } from 'designSystem'
import { BottomNavigation } from 'react-native-paper'

const WorkoutStepScreen: React.FC = () => {
  const [index, setIndex] = useState(1)

  const routes = useMemo(
    () => [
      {
        key: 'stats',
        title: 'Stats',
        focusedIcon: () => <Icon icon="analytics" />,
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
    stats: WorkoutExerciseStatsView,
    track: TrackView,
  })

  return (
    <EmptyLayout>
      <StepHeader />

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
