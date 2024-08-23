import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Searchbar } from 'react-native-paper'

import ExerciseAcordionList from './ExerciseAcordionList'
import ExerciseList from './ExerciseList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { groupBy } from 'app/utils/array'
import { translate } from 'app/i18n'

const noop = () => {}

type Props = {
  onSelect?: (exercise: Exercise) => void
}
const AllExerciseSelect: React.FC<Props> = ({ onSelect }) => {
  const { exerciseStore } = useStores()

  const [filterString, setFilterString] = useState('')

  const groupedExercises = useMemo(
    () => groupBy<Exercise>(exerciseStore.exercises, 'muscles'),
    [exerciseStore.exercises]
  )

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
          <ExerciseAcordionList
            exercises={groupedExercises}
            onSelect={onSelect ?? noop}
          />
        )}
        {filterString !== '' && (
          <ExerciseList
            exercises={filteredExercises}
            onSelect={onSelect ?? noop}
          />
        )}
      </ScrollView>
    </>
  )
}

export default observer(AllExerciseSelect)
