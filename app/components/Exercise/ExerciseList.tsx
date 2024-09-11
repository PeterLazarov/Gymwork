import React from 'react'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  onReorder: (from: number, to: number) => void
}
const ExerciseList: React.FC<Props> = ({
  exercises,
  onSelect,
  selectedExercises,
  onReorder,
}) => {
  const renderItem = ({
    item,
    onDragStart,
    onDragEnd,
    isActive,
  }: DragListRenderItemInfo<Exercise>) => {
    return (
      <ExerciseListItem
        exercise={item}
        onSelect={onSelect}
        isSelected={selectedExercises.includes(item)}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
      />
    )
  }

  return (
    <DragList
      data={exercises.slice()}
      renderItem={renderItem}
      keyExtractor={exercise => exercise.guid}
      onReordered={onReorder}
      // estimatedItemSize={69}
    />
  )
}

export default ExerciseList
