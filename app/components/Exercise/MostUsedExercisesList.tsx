import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import { searchString } from 'app/utils/string'

import EmptyState from '../EmptyState'

import ExerciseList from './ExerciseList'

const noop = () => {}

export type MostUsedExercisesListProps = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  filterString: string
}
const MostUsedExercisesList: React.FC<MostUsedExercisesListProps> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const { workoutStore } = useStores()

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return workoutStore.mostUsedExercises
    }

    const filtered = workoutStore.mostUsedExercises.filter((e: Exercise) => {
      const exName = e.name.toLowerCase()

      return searchString(
        filterString,
        word => exName.includes(word) || e.muscles.includes(word)
      )
    })

    return filtered
  }, [filterString])

  return (
    <>
      {workoutStore.mostUsedExercises.length > 0 ? (
        <ExerciseList
          exercises={filteredExercises}
          onSelect={onSelect ?? noop}
          selectedExercises={selectedExercises}
        />
      ) : (
        <EmptyState text={translate('noWorkoutsEntered')} />
      )}
    </>
  )
}

export default observer(MostUsedExercisesList)
