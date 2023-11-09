import { observer } from 'mobx-react-lite'
import React from 'react'
import { List } from 'react-native-paper'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from '../../db/models'
import { capitalize } from '../../utils/string'

type Props = {
  exercises: Record<string, Exercise[]>
  onSelect: (exercise: Exercise) => void
}
const ExerciseAcordionList: React.FC<Props> = ({ exercises, onSelect }) => {
  return (
    <>
      {Object.keys(exercises).map(group => (
        <List.Accordion
          title={`${capitalize(group)} (${exercises[group].length})`}
        >
          {exercises[group].map(exercise => (
            <ExerciseListItem
              exercise={exercise}
              onSelect={onSelect}
            />
          ))}
        </List.Accordion>
      ))}
    </>
  )
}

export default observer(ExerciseAcordionList)
