import React, { useCallback, useMemo } from 'react'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { View } from 'react-native'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}

const itemHeight = 60

const ExerciseList: React.FC<Props> = ({
  exercises,
  onSelect,
  selectedExercises,
}) => {
  const exercisesSansSelected = useMemo(() => {
    return exercises.filter(
      e => !selectedExercises.some(({ guid }) => guid === e.guid)
    )
  }, [exercises, selectedExercises])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Exercise>) => {
      return (
        <ExerciseListItem
          exercise={item}
          onSelect={onSelect}
          isSelected={false}
          height={itemHeight}
        />
      )
    },
    [selectedExercises]
  )

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={exercisesSansSelected}
        estimatedItemSize={itemHeight}
        renderItem={renderItem}
        keyExtractor={exercise => exercise.guid}
      />
      <View style={{}}>
        {selectedExercises.map(e => (
          <ExerciseListItem
            exercise={e}
            onSelect={onSelect}
            isSelected={true}
            height={40}
            key={e.guid}
          />
        ))}
      </View>
    </View>
  )
}

export default ExerciseList
