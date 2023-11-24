import { observer } from 'mobx-react-lite'

import ExerciseList from './ExerciseList'
import { useStores } from '../../db/helpers/useStores'
import { Exercise } from '../../db/models'

const noop = () => {}

type Props = {
  onSelect?: (exercise: Exercise) => void
}
const FavoriteExerciseSelect: React.FC<Props> = ({ onSelect }) => {
  const { workoutStore } = useStores()

  // TODO: handle empty state
  // TODO: convert most used to favorited exercises?
  return (
    <ExerciseList
      exercises={workoutStore.mostUsedExercises}
      onSelect={onSelect ?? noop}
    />
  )
}

export default observer(FavoriteExerciseSelect)
