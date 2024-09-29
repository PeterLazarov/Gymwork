import { observer } from 'mobx-react-lite'
import { useMemo, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Searchbar } from 'react-native-paper'

import ExerciseAccordionList from './ExerciseAccordionList'
import ExerciseList from './ExerciseList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import { useDebounce } from '@uidotdev/usehooks'

const noop = () => {}

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const AllExercisesList: React.FC<Props> = ({ onSelect, selectedExercises }) => {
  const { exerciseStore } = useStores()
  const exercisesSorted = useRef(
    exerciseStore.exercises.slice().sort((a, b) => a.name.localeCompare(b.name))
  )

  const [filterString, setFilterString] = useState('')
  const debouncedFilterString = useDebounce(filterString, 200)

  const filteredExercises = useMemo(() => {
    if (!debouncedFilterString) {
      return exercisesSorted.current
    }

    return exercisesSorted.current.filter((e: Exercise) => {
      const exName = e.name.toLowerCase()
      const filterWords = debouncedFilterString
        .toLowerCase()
        .split(' ')
        .filter(Boolean)

      return filterWords.every(
        word =>
          exName.includes(word) ||
          (filterWords.length > 1 && e.muscles.includes(word))
      )
    })
  }, [debouncedFilterString])

  return (
    <>
      <Searchbar
        placeholder={translate('search')}
        onChangeText={setFilterString}
        value={filterString}
        mode="view"
      />
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        {filterString === '' ? (
          <ScrollView>
            <ExerciseAccordionList
              exercises={exerciseStore.exercisesByMuscle}
              onSelect={onSelect ?? noop}
              selectedExercises={selectedExercises}
            />
          </ScrollView>
        ) : (
          <ExerciseList
            exercises={filteredExercises}
            onSelect={onSelect ?? noop}
            selectedExercises={selectedExercises}
          />
        )}
      </View>
    </>
  )
}

export default observer(AllExercisesList)
