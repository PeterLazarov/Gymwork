import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { View } from 'react-native'

import ExerciseList from './ExerciseList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { searchString } from 'app/utils/string'

const noop = () => {}

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  filterString: string
}
const AllExercisesList: React.FC<Props> = ({
  onSelect,
  selectedExercises,
  filterString,
}) => {
  const { exerciseStore } = useStores()

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return exerciseStore.exercises
    }

    const filtered = exerciseStore.exercises.filter((e: Exercise) => {
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
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ExerciseList
          exercises={filteredExercises}
          onSelect={onSelect ?? noop}
          selectedExercises={selectedExercises}
        />
      </View>
    </>
  )
}

export default observer(AllExercisesList)
