import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { Searchbar } from 'react-native-paper'

import ExerciseList from './ExerciseList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import { translate } from 'app/i18n'
import { searchString } from 'app/utils/string'

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
