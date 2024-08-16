import { observer } from 'mobx-react-lite'
import React from 'react'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import { ScrollView } from 'react-native'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
}
const ExerciseList: React.FC<Props> = ({ exercises, onSelect }) => {
  return (
    <ScrollView>
      {exercises.map(exercise => (
        <ExerciseListItem
          key={exercise.guid}
          exercise={exercise}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  )
}

export default observer(ExerciseList)
