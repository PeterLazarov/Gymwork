import React from 'react'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import { FlatList, ListRenderItemInfo } from 'react-native'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const ExerciseList: React.FC<Props> = ({
  exercises,
  onSelect,
  selectedExercises,
}) => {
  const renderItem = ({ item }: ListRenderItemInfo<Exercise>) => {
    return (
      <ExerciseListItem
        exercise={item}
        onSelect={onSelect}
        isSelected={selectedExercises.includes(item)}
      />
    )
  }

  return (
    <FlatList
      data={exercises.slice()}
      renderItem={renderItem}
      keyExtractor={exercise => exercise.guid}
    />
  )
}

export default ExerciseList
