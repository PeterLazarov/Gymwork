import { observer } from 'mobx-react-lite'
import React from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { Exercise, Workout } from 'app/db/models'
import WorkoutExerciseCard from '../WorkoutExercise/WorkoutExerciseCard'

type Props = {
  workout: Workout
}

const WorkoutExerciseList: React.FC<Props> = ({ workout }) => {
  const renderItem = ({ item }: ListRenderItemInfo<Exercise>) => (
    <WorkoutExerciseCard
      key={`${workout!.date}_${item.guid}`}
      workout={workout!}
      exercise={item}
    />
  )

  return (
    <FlashList
      data={workout.exercises}
      renderItem={renderItem}
      estimatedItemSize={140}
    />
  )
}
export default observer(WorkoutExerciseList)
