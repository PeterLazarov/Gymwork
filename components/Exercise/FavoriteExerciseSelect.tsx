import { observer } from 'mobx-react-lite'
import { Text, View } from 'react-native'

import ExerciseList from './ExerciseList'
import { useStores } from '../../db/helpers/useStores'
import { Exercise } from '../../db/models'
import colors from '../../designSystem/colors'

const noop = () => {}

type Props = {
  onSelect?: (exercise: Exercise) => void
}
const FavoriteExerciseSelect: React.FC<Props> = ({ onSelect }) => {
  const { workoutStore } = useStores()

  // TODO: convert most used to favorited exercises?
  return (
    <>
      {workoutStore.mostUsedExercises.length < 0 && (
        <ExerciseList
          exercises={workoutStore.mostUsedExercises}
          onSelect={onSelect ?? noop}
        />
      )}
      {workoutStore.mostUsedExercises.length > 0 && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 18, color: colors.gray }}>
            No workouts entered yet
          </Text>
        </View>
      )}
    </>
  )
}

export default observer(FavoriteExerciseSelect)
