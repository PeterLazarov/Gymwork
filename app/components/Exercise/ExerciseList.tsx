import React, { useCallback, forwardRef } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'

import { TabHeightCompensation } from '@/navigators/constants'
import { Exercise } from 'app/db/models'

import ExerciseListItem from './ExerciseListItem'

export type ExerciseListProps = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}

const itemHeight = 64

const ExerciseList = forwardRef<FlatList<Exercise>, ExerciseListProps>(
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
        // estimatedItemSize={itemHeight}
        renderItem={renderItem}
        keyExtractor={exercise => exercise.guid}
        contentContainerStyle={{ paddingBottom: TabHeightCompensation }}
      />
    )
  }
)

ExerciseList.displayName = 'ExerciseList'

export default ExerciseList
