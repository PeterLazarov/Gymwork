import { observer } from 'mobx-react-lite'
import React from 'react'
import { List } from 'react-native-paper'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import { capitalize } from 'app/utils/string'

type Props = {
  exercises: Record<string, Exercise[]>
  onSelect: (exercise: Exercise) => void
}
const ExerciseAcordionList: React.FC<Props> = ({ exercises, onSelect }) => {
  return (
    <>
      {Object.keys(exercises).map(group => (
        <List.Accordion
          key={group}
          title={`${capitalize(group)} (${exercises[group].length})`}
        >
          {exercises[group].map(exercise => (
            <ExerciseListItem
              key={exercise.guid}
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
