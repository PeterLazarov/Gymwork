import { observer } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { ListRenderItemInfo } from '@shopify/flash-list'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import DayControl from 'app/components/Workout/DayControl'
import WorkoutControlButtons from 'app/components/Workout/WorkoutControlButtons'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutExerciseStatsView from 'app/components/ExerciseStats/ExerciseStatsView'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import { HorizontalScreenList } from 'designSystem'

type Screen = {
  name: string
  component: FunctionComponent
}

const WorkoutPage: React.FC = () => {
  const screens: Screen[] = [
    { name: 'Stats', component: WorkoutExerciseStatsView },
    { name: 'Workout', component: WorkoutDayView },
  ]

  const renderItem = ({
    item: { name, component: Component },
  }: ListRenderItemInfo<Screen>) => {
    return <Component key={name} />
  }

  return (
    <EmptyLayout>
      <WorkoutHeader />
      <DayControl />
      <View style={{ flex: 1 }}>
        <HorizontalScreenList
          data={screens}
          renderItem={renderItem}
          initialScrollIndex={1}
        />
      </View>
      <WorkoutControlButtons />
    </EmptyLayout>
  )
}
export default observer(WorkoutPage)
