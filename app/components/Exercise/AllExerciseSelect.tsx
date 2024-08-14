import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Searchbar } from 'react-native-paper'

import ExerciseAcordionList from './ExerciseAcordionList'
import ExerciseList from './ExerciseList'
import { useStores } from '../../db/helpers/useStores'
import { Exercise } from '../../db/models'
import texts from '../../../texts'
import { groupBy } from '../../utils/array'

const noop = () => {}

type Props = {
  onSelect?: (exercise: Exercise) => void
}
const AllExerciseSelect: React.FC<Props> = ({ onSelect }) => {
  const { exerciseStore } = useStores()

  const [filterString, setFilterString] = useState('')
  // const [filterMuscle, setFilterMuscle] = useState('')

  const groupedExercises = useMemo(
    () => groupBy<Exercise>(exerciseStore.exercises, 'muscles'),
    [exerciseStore.exercises]
  )

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return exerciseStore.exercises
    }

    return exerciseStore.exercises.filter(e =>
      e.name.toLowerCase().includes(filterString.toLowerCase())
    )
  }, [filterString, exerciseStore.exercises])

  return (
    <>
      <Searchbar
        placeholder={texts.search}
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
