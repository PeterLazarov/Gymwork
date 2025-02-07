import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import React, { useCallback, forwardRef } from 'react'
import { FlatList } from 'react-native'

import { TabHeightCompensation } from '@/navigators/constants'
import { Exercise } from 'app/db/models'

import ExerciseListItem from './ExerciseListItem'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}

const itemHeight = 64

const ExerciseList = forwardRef<FlashList<Exercise>, Props>(
  ({ exercises, onSelect, selectedExercises }, ref) => {
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
      <FlatList
        ref={ref}
        nestedScrollEnabled={true}
        data={exercises}
        estimatedItemSize={itemHeight}
        renderItem={renderItem}
        keyExtractor={exercise => exercise.guid}
        contentContainerStyle={{ paddingBottom: TabHeightCompensation }}
      />
    )
  }
)

ExerciseList.displayName = 'ExerciseList'

export default ExerciseList
