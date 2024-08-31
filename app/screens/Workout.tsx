import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

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
  const flashList = useRef<FlashList<Screen>>(null)
  const [activeIndex, setActiveIndex] = useState(1)

  useEffect(() => {
    const navigateToIndex = stateStore.focusedStep ? 2 : 1

    flashList.current?.scrollToIndex({
      animated: true,
      index: navigateToIndex,
    })
    setActiveIndex(navigateToIndex)
  }, [stateStore.openedDate, stateStore.focusedStepGuid])

  const screens: Screen[] = [
    { name: 'Stats', component: WorkoutExerciseStatsView },
    { name: 'Workout', component: WorkoutDayView },
    { name: 'Edit', component: TrackView },
  ]

  const renderItem = ({
    item: { component: Component },
  }: ListRenderItemInfo<Screen>) => {
    return <Component />
  }

  return (
    <EmptyLayout>
      {screens[activeIndex].name === 'Stats' && <StepHeader />}
      {screens[activeIndex].name === 'Workout' && <WorkoutHeader />}
      {screens[activeIndex].name === 'Edit' && <StepHeader />}

      <View style={{ flex: 1 }}>
        <HorizontalScreenList
          ref={flashList}
          data={screens}
          renderItem={renderItem}
          initialScrollIndex={1}
          keyExtractor={item => item.name}
        />
      </View>
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
