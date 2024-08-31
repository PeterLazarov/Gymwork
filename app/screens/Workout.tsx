import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import type { ICarouselInstance } from 'react-native-reanimated-carousel'
import { CarouselRenderItem } from 'react-native-reanimated-carousel'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutExerciseStatsView from 'app/components/ExerciseStats/ExerciseStatsView'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import TrackView from 'app/components/WorkoutExercise/TrackView'
import { useStores } from 'app/db/helpers/useStores'
import StepHeader from 'app/components/WorkoutStep/StepHeader'
import { HorizontalScreenList } from 'designSystem'

type Screen = {
  name: string
  component: FunctionComponent
}

const WorkoutPageScreen: React.FC = () => {
  const { stateStore } = useStores()
  const screenList = useRef<ICarouselInstance>(null)

  const screens: Screen[] = [
    { name: 'Stats', component: WorkoutExerciseStatsView },
    { name: 'Workout', component: WorkoutDayView },
    { name: 'Edit', component: TrackView },
  ]
  const workoutScreenIndex = 1
  const editScreenIndex = 2

  useEffect(() => {
    const shouldNavigate = !!stateStore.focusedStep

    if (shouldNavigate) {
      screenList.current?.scrollTo({
        animated: true,
        index: editScreenIndex,
      })
    }
  }, [stateStore.openedDate, stateStore.focusedStepGuid])

  const renderItem: CarouselRenderItem<Screen> = ({
    item: { name, component: Component },
  }) => {
    return <Component key={name} />
  }

  return (
    <EmptyLayout>
      {stateStore.focusedStep && <StepHeader />}
      {!stateStore.focusedStep && <WorkoutHeader />}

      <HorizontalScreenList
        ref={screenList}
        data={screens}
        renderItem={renderItem}
        defaultIndex={workoutScreenIndex}
      />
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
