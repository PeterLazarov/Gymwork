import { observer } from 'mobx-react-lite'
import React from 'react'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from '../../db/models'

type Props = {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
}
const ExerciseAcordionList: React.FC<Props> = ({ exercises, onSelect }) => {
  return (
    <>
      {exercises.map(exercise => (
        <ExerciseListItem
          exercise={exercise}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

export default observer(ExerciseAcordionList)
