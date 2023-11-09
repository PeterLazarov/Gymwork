import { observer } from 'mobx-react-lite'
import React from 'react'
import { List } from 'react-native-paper'

import { Exercise } from '../../db/models'

type Props = {
  exercise: Exercise
  onSelect: (exercise: Exercise) => void
}
const ExerciseAcordionList: React.FC<Props> = ({ exercise, onSelect }) => {
  return (
    <List.Item
      title={exercise.name}
      onPress={() => onSelect(exercise)}
    />
  )
}

export default observer(ExerciseAcordionList)
