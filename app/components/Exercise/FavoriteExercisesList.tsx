import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const FavoriteExercisesList: React.FC<Props> = ({
  onSelect,
  selectedExercises,
}) => {
  const { exerciseStore } = useStores()

  return (
    <>
      {exerciseStore.favoriteExercises.length > 0 && (
        <ExerciseList
          exercises={exerciseStore.favoriteExercises}
          onSelect={onSelect}
          selectedExercises={selectedExercises}
        />
      )}
      {exerciseStore.favoriteExercises.length === 0 && (
        <EmptyState text={translate('noFavoriteExercises')} />
      )}
    </>
  )
}

export default observer(FavoriteExercisesList)
