import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect, useRef } from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutExerciseStatsView from 'app/components/ExerciseStats/ExerciseStatsView'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import TrackView from 'app/components/WorkoutExercise/TrackView'
import { useStores } from 'app/db/helpers/useStores'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import { HorizontalScreenList } from 'designSystem'
import { FlatList, ListRenderItemInfo } from 'react-native'

type Screen = {
  name: string
  component: FunctionComponent
}

const WorkoutPageScreen: React.FC = () => {
  const { stateStore } = useStores()
  const screenList = useRef<FlatList<Screen>>(null)

  const screens: readonly Screen[] = [
    { name: 'Stats', component: WorkoutExerciseStatsView },
    { name: 'Workout', component: WorkoutDayView },
    { name: 'Edit', component: TrackView },
  ]
  const workoutScreenIndex = 1
  const editScreenIndex = 2

  useEffect(() => {
    const shouldNavigate = !!stateStore.focusedStep

    if (shouldNavigate) {
      screenList.current?.scrollToIndex({
        animated: true,
        index: editScreenIndex,
      })
    }
  }, [stateStore.openedDate, stateStore.focusedStepGuid])

  const renderItem = ({
    item: { component: Component },
  }: ListRenderItemInfo<Screen>) => {
    return <Component />
  }

  return (
    <EmptyLayout>
      {stateStore.focusedStep && <StepHeader />}
      {!stateStore.focusedStep && <WorkoutHeader />}

      <HorizontalScreenList
        ref={screenList}
        data={screens}
        renderItem={renderItem}
        initialScrollIndex={workoutScreenIndex}
        keyExtractor={item => item.name}
      />
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
