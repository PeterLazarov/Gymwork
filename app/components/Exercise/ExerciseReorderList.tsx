import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'

type ExerciseReorderListProps = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  onReorder: (from: number, to: number) => void
}
const ExerciseReorderList: React.FC<ExerciseReorderListProps> = ({
  onSelect,
  selectedExercises,
  onReorder,
}) => {
  const { exerciseStore } = useStores()

  return (
    <>
      {exerciseStore.favoriteExercises.length > 0 && (
        <ExerciseList
          exercises={selectedExercises}
          onSelect={onSelect}
          selectedExercises={selectedExercises}
          onReorder={onReorder}
        />
      )}

      {exerciseStore.favoriteExercises.length === 0 && (
        <EmptyState text={translate('noExercisesSelected')} />
      )}
    </>
  )
}

export default observer(ExerciseReorderList)
