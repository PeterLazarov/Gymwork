import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'
import { useState, useMemo } from 'react'
import { searchString } from 'app/utils/string'
import { View } from 'react-native'
import { Searchbar } from 'react-native-paper'

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

  const [filterString, setFilterString] = useState('')

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return workoutStore.mostUsedExercises
    }

    const filtered = workoutStore.mostUsedExercises.filter((e: Exercise) => {
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
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <Searchbar
          style={{ flexGrow: 1 }}
          placeholder={translate('search')}
          onChangeText={setFilterString}
          mode="view"
          defaultValue={filterString}
        />
      </View>

      {workoutStore.mostUsedExercises.length > 0 ? (
        <ExerciseList
          exercises={filteredExercises}
          onSelect={onSelect ?? noop}
          selectedExercises={selectedExercises}
        />
      ) : (
        <EmptyState text={translate('noWorkoutsEntered')} />
      )}
    </>
  )
}

export default observer(MostUsedExercisesList)
