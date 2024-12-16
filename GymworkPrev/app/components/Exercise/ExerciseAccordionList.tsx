import React from 'react'
import { List } from 'react-native-paper'

import ExerciseListItem from './ExerciseListItem'
import { Exercise } from 'app/db/models'
import { capitalize } from 'app/utils/string'

export type ExerciseAccordionListProps = {
  /** key is muscle */
  exercises: Record<string, Exercise[]>
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const ExerciseAccordionList: React.FC<ExerciseAccordionListProps> = ({
  exercises,
  onSelect,
  selectedExercises,
}) => {
  return (
    <>
      {Object.entries(exercises).map(([muscleGroup, exercises]) => (
        <List.Accordion
          key={muscleGroup}
          title={`${capitalize(muscleGroup)} (${exercises.length})`}
        >
          {exercises.map(exercise => (
            <ExerciseListItem
              key={exercise.guid}
              exercise={exercise}
              onSelect={onSelect}
              isSelected={selectedExercises.includes(exercise)}
            />
          ))}
        </List.Accordion>
      ))}
    </>
  )
}

export default ExerciseAccordionList
