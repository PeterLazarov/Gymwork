import { FlashList } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import { forwardRef, useMemo } from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { searchString } from 'app/utils/string'

import ExerciseList from './ExerciseList'

const noop = () => {}

type AllExercisesListProps = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
  filterString: string
}

const AllExercisesList = forwardRef<FlashList<Exercise>, AllExercisesListProps>(
  ({ onSelect, selectedExercises, filterString }, ref) => {
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
      <ExerciseList
        ref={ref}
        exercises={filteredExercises}
        onSelect={onSelect ?? noop}
        selectedExercises={selectedExercises}
      />
    )
  }
)

export default observer(AllExercisesList)
