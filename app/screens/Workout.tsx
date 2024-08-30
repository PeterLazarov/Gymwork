import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutExerciseStatsView from 'app/components/ExerciseStats/ExerciseStatsView'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import TrackView from 'app/components/WorkoutExercise/TrackView'
import { HorizontalScreenList } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'

type Screen = {
  name: string
  component: FunctionComponent
}

const WorkoutPageScreen: React.FC = () => {
  const { stateStore } = useStores()
  const flashList = useRef<FlashList<Screen>>(null)

  useEffect(() => {
    const navigateToIndex = stateStore.focusedStepGuid ? 2 : 1

    flashList.current?.scrollToIndex({
      animated: true,
      index: navigateToIndex,
    })
  }, [stateStore.openedDate, stateStore.focusedStepGuid])

  const screens: Screen[] = [
    { name: 'Stats', component: WorkoutExerciseStatsView },
    { name: 'Workout', component: WorkoutDayView },
    { name: 'Edit', component: TrackView },
  ]

  const renderItem = ({
    item: { name, component: Component },
  }: ListRenderItemInfo<Screen>) => {
    return <Component key={name} />
  }

  return (
    <EmptyLayout>
      <WorkoutHeader />
      <View style={{ flex: 1 }}>
        <HorizontalScreenList
          ref={flashList}
          data={screens}
          renderItem={renderItem}
          initialScrollIndex={1}
        />
      </View>
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
