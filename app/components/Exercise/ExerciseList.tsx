import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import React, { useCallback } from 'react'

import { Exercise } from 'app/db/models'

import ExerciseListItem from './ExerciseListItem'
import { TabHeightCompensation } from '@/navigators/BottomNavigator'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}

const itemHeight = 64

const ExerciseList: React.FC<Props> = ({
  exercises,
  onSelect,
  selectedExercises,
}) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Exercise>) => {
      return (
        <ExerciseListItem
          exercise={item}
          onSelect={onSelect}
          isSelected={selectedExercises.includes(item)}
          height={itemHeight}
        />
      )
    },
    [selectedExercises]
  )

  return (
    <FlashList
      data={exercises}
      estimatedItemSize={itemHeight}
      renderItem={renderItem}
      keyExtractor={exercise => exercise.guid}
      contentContainerStyle={{ paddingBottom: TabHeightCompensation }}
    />
  )
}

export default ExerciseList
