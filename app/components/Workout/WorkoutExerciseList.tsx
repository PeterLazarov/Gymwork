import { observer } from 'mobx-react-lite'
import React from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { Workout, WorkoutStep } from 'app/db/models'
import WorkoutExerciseCard from '../WorkoutExercise/WorkoutExerciseCard'

type Props = {
  workout: Workout
}

const WorkoutExerciseList: React.FC<Props> = ({ workout }) => {
  const renderItem = ({ item }: ListRenderItemInfo<WorkoutStep>) => (
    <WorkoutExerciseCard step={item} />
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
export default observer(WorkoutExerciseList)
