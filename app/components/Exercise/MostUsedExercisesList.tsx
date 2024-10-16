import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'

const noop = () => {}

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const MostUsedExercisesList: React.FC<Props> = ({
  onSelect,
  selectedExercises,
}) => {
  const { workoutStore } = useStores()

  return (
    <>
      {workoutStore.mostUsedExercises.length > 0 && (
        <ExerciseList
          exercises={workoutStore.mostUsedExercises}
          onSelect={onSelect ?? noop}
          selectedExercises={selectedExercises}
        />
      )}
      {workoutStore.mostUsedExercises.length === 0 && (
        <EmptyState text={translate('noWorkoutsEntered')} />
      )}
    </>
  )
}

export default observer(MostUsedExercisesList)
