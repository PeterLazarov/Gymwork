import React from 'react'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
}
const ExerciseList: React.FC<Props> = ({ exercises, onSelect }) => {
  const renderItem = ({ item }: ListRenderItemInfo<Exercise>) => {
    return (
      <ExerciseListItem
        exercise={item}
        onSelect={onSelect}
      />
    )
  }

  return (
    <FlashList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={exercise => exercise.guid}
      estimatedItemSize={69}
    />
  )
}

export default ExerciseList
