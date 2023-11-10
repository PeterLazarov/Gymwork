import { observer } from 'mobx-react-lite'
import { ScrollView } from 'react-native'
import { Searchbar } from 'react-native-paper'
import texts from '../../texts'
import ExerciseAcordionList from './ExerciseAcordionList'
import ExerciseList from './ExerciseList'
import { useMemo, useState } from 'react'
import { Exercise } from '../../db/models'
import { useStores } from '../../db/helpers/useStores'
import { groupBy } from '../../utils/array'

const noop = () => {}

const ExerciseSelect = observer(
  (props: { onSelect?: (exercise: Exercise) => void }) => {
    const { exerciseStore, workoutStore } = useStores()

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

      return exerciseStore.exercises.filter(
        e => e.name.indexOf(filterString) !== -1
      )
    }, [])

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
              onSelect={props.onSelect ?? noop}
            />
          )}
          {filterString !== '' && (
            <ExerciseList
              exercises={filteredExercises}
              onSelect={props.onSelect ?? noop}
            />
          )}
        </ScrollView>
      </>
    )
  }
)

export default ExerciseSelect
