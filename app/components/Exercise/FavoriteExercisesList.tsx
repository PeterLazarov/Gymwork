import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise } from 'app/db/models'
import ExerciseList from './ExerciseList'
import EmptyState from '../EmptyState'
import { translate } from 'app/i18n'
import { searchString } from 'app/utils/string'
import { useState, useMemo } from 'react'
import { View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { spacing } from 'designSystem'

type Props = {
  onSelect: (exercise: Exercise) => void
  selectedExercises: Exercise[]
}
const FavoriteExercisesList: React.FC<Props> = ({
  onSelect,
  selectedExercises,
}) => {
  const { exerciseStore } = useStores()

  const [filterString, setFilterString] = useState('')

  const filteredExercises = useMemo(() => {
    if (!filterString) {
      return exerciseStore.favoriteExercises
    }

    const filtered = exerciseStore.favoriteExercises.filter((e: Exercise) => {
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
          gap: spacing.xs,
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

      {exerciseStore.favoriteExercises.length > 0 ? (
        <ExerciseList
          exercises={filteredExercises}
          onSelect={onSelect}
          selectedExercises={selectedExercises}
        />
      ) : (
        <EmptyState text={translate('noFavoriteExercises')} />
      )}
    </>
  )
}

export default observer(FavoriteExercisesList)
