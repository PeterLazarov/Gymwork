import { observer } from 'mobx-react-lite'
import React from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { Workout, WorkoutStep } from 'app/db/models'
import WorkoutStepCard from '../WorkoutStep/WorkoutStepCard'

type Props = {
  workout: Workout
}

const WorkoutStepList: React.FC<Props> = ({ workout }) => {
  const renderItem = ({ item }: ListRenderItemInfo<WorkoutStep>) => (
    <WorkoutStepCard step={item} />
  )

  return (
    <FlashList
      data={workout.steps.slice()}
      renderItem={renderItem}
      keyExtractor={item => `${workout!.date}_${item.guid}`}
      estimatedItemSize={140}
    />
  )
}
export default observer(WorkoutStepList)
