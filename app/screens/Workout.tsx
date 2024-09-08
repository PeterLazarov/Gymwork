import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useState } from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutExerciseStatsView from 'app/components/ExerciseStats/ExerciseStatsView'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import TrackView from 'app/components/WorkoutStep/TrackView'
import { useStores } from 'app/db/helpers/useStores'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import { Icon, boxShadows, colors } from 'designSystem'
import { BottomNavigation } from 'react-native-paper'

const WorkoutPageScreen: React.FC = () => {
  const { stateStore } = useStores()

  const workoutScreenIndex = 1
  const editScreenIndex = 2
  const [index, setIndex] = useState(workoutScreenIndex)

  useEffect(() => {
    const hasFocusedStep = !!stateStore.focusedStep

    const newIndex = hasFocusedStep ? editScreenIndex : workoutScreenIndex
    setIndex(newIndex)
  }, [
    stateStore.openedDate,
    stateStore.focusedStepGuid,
    stateStore.focusedSetGuid,
  ])

  const routes = useMemo(
    () => [
      {
        key: 'stats',
        title: 'Stats',
        focusedIcon: () => <Icon icon="analytics" />,
      },
      {
        key: 'workout',
        title: 'Workout',
        focusedIcon: () => <Icon icon="dumbbell" />,
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
    workout: WorkoutDayView,
    track: TrackView,
  })

  return (
    <EmptyLayout>
      {stateStore.focusedStep && <StepHeader />}
      {!stateStore.focusedStep && <WorkoutHeader />}

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          backgroundColor: colors.neutralLight,
          ...boxShadows.lg,
        }}
        activeIndicatorStyle={{ backgroundColor: colors.primaryLight }}
      />
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
