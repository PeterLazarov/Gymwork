import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import { searchString } from 'app/utils/string'

import EmptyState from '../EmptyState'

import ExerciseList from './ExerciseList'

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  filterString: string
}
const FavoriteExercisesList: React.FC<Props> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const { exerciseStore } = useStores()

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return exerciseStore.favoriteExercises
    }

    const filtered = exerciseStore.favoriteExercises.filter((e: Exercise) => {
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
      {exerciseStore.favoriteExercises.length > 0 ? (
        <ExerciseList
          exercises={filteredExercises}
          onSelect={onSelect}
          selectedExercises={selectedExercises}
        />
      ) : (
        <EmptyState text={translate('noFavoriteExercises')} />
      )}
    </>
  )
}

export default observer(FavoriteExercisesList)
