import React, { useState, useMemo } from 'react'
import { View } from 'react-native'
import { Searchbar } from 'react-native-paper'

import { discomfortOptions, Workout } from '@/db/models'
import { translate } from '@/i18n'
import { searchString } from '@/utils/string'
import { FeedbackPickerOption } from 'designSystem'

export interface WorkoutReviewFiltersProps {
  // TODO
}

export const WorkoutReviewFilters: React.FC<
  WorkoutReviewFiltersProps
> = props => {
  const { workoutStore } = useStores()

  const [filterString, setFilterString] = useState('')
  const [filterDiscomforedLevels, setFilterDiscomforedLevels] = useState<
    string[]
  >([])

  function filterWorkout(workout: Workout) {
    const discomfortFilter =
      filterDiscomforedLevels.length === 0 ||
      (workout.pain && filterDiscomforedLevels.includes(workout.pain))

    const notesFilter =
      filterString === '' ||
      (workout.notes !== '' &&
        searchString(filterString, word =>
          workout.notes.toLowerCase().includes(word)
        ))

    return discomfortFilter && notesFilter
  }

  const filteredWorkouts = useMemo(() => {
    return workoutStore.sortedReverseWorkouts.filter(filterWorkout)
  }, [workoutStore.workouts, filterDiscomforedLevels, filterString])

  const [openedWorkout, setOpenedWorkout] = useState<Workout | undefined>()

  function onDiscomfortFilterPress(optionValue: string) {
    const isSelected = filterDiscomforedLevels.includes(optionValue)
    if (isSelected) {
      setFilterDiscomforedLevels(oldValue =>
        oldValue.filter(opt => opt !== optionValue)
      )
    } else {
      setFilterDiscomforedLevels(oldValue => [...oldValue, optionValue])
    }
  }

  return (
    <>
      <Searchbar
        placeholder={translate('search')}
        onChangeText={setFilterString}
        value={filterString}
        mode="view"
      />
      <View style={styles.filterOptionList}>
        {Object.values(discomfortOptions).map(option => (
          <FeedbackPickerOption
            key={option.value}
            option={option}
            isSelected={filterDiscomforedLevels.includes(option.value)}
            onPress={() => onDiscomfortFilterPress(option.value)}
            compactMode
            style={styles.filterOption}
          />
        ))}
      </View>
    </>
  )
}
