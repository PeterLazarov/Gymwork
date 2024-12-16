import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'
import { useMemo } from 'react'
import { searchString } from 'app/utils/string'

const noop = () => {}

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  filterString: string
}
const MostUsedExercisesList: React.FC<Props> = ({
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
