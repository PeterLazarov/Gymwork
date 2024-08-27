import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'

const noop = () => {}

type Props = {
  onSelect?: (exercise: Exercise) => void
}
const FavoriteExercisesList: React.FC<Props> = ({ onSelect }) => {
  const { exerciseStore } = useStores()

  return (
    <>
      {exerciseStore.favoriteExercises.length > 0 && (
        <ExerciseList
          exercises={exerciseStore.favoriteExercises}
          onSelect={onSelect ?? noop}
        />
      )}
      {exerciseStore.favoriteExercises.length === 0 && (
        <EmptyState text={translate('noFavoriteExercises')} />
      )}
    </>
  )
}

export default observer(FavoriteExercisesList)
