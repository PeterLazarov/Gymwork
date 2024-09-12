import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Searchbar } from 'react-native-paper'

import ExerciseAccordionList from './ExerciseAccordionList'
import ExerciseList from './ExerciseList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'

const noop = () => {}

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const AllExercisesList: React.FC<Props> = ({ onSelect, selectedExercises }) => {
  const { exerciseStore } = useStores()

  const [filterString, setFilterString] = useState('')

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return exerciseStore.exercises
    }

    return exerciseStore.exercises
      .filter((e: Exercise) => {
        const exName = e.name.toLowerCase()
        const filterWords = filterString
          .toLowerCase()
          .split(' ')
          .filter(Boolean)

        return filterWords.every(
          word =>
            exName.includes(word) ||
            (filterWords.length > 1 && e.muscles.includes(word))
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filterString, exerciseStore.exercises])

  return (
    <>
      <Searchbar
        placeholder={translate('search')}
        onChangeText={setFilterString}
        value={filterString}
        mode="view"
      />
      <ScrollView style={{ display: 'flex', flexDirection: 'column' }}>
        {filterString === '' && (
          <ExerciseAccordionList
            exercises={exerciseStore.exercisesByMuscle}
            onSelect={onSelect ?? noop}
            selectedExercises={selectedExercises}
          />
        )}
        {filterString !== '' && (
          <ExerciseList
            exercises={filteredExercises}
            onSelect={onSelect ?? noop}
            selectedExercises={selectedExercises}
          />
        )}
      </ScrollView>
    </>
  )
}

export default observer(AllExercisesList)
