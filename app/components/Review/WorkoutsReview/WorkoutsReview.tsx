import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { ListRenderItemInfo } from '@shopify/flash-list'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Workout, discomfortOptions } from 'app/db/models'
import WorkoutReviewListItem from './WorkoutReviewListItem'
import WorkoutModal from 'app/components/WorkoutModal'
import {
  Divider,
  FeedbackPickerOption,
  IndicatedScrollList,
} from 'designSystem'
import { searchString } from 'app/utils/string'

const WorkoutsReview: React.FC = () => {
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

  const renderItem = ({ item }: ListRenderItemInfo<Workout>) => {
    return (
      <>
        <WorkoutReviewListItem
          workout={item}
          onPress={() => setOpenedWorkout(item)}
        />
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
      </>
    )
  }

  return (
    <>
      <View style={styles.screen}>
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
        {filteredWorkouts.length > 0 ? (
          <IndicatedScrollList
            data={filteredWorkouts}
            renderItem={renderItem}
            keyExtractor={workout => `${workout.date}_${workout.guid}`}
            estimatedItemSize={157}
          />
        ) : (
          <EmptyState text={translate('commentsLogEmpty')} />
        )}
      </View>
      {openedWorkout && (
        <WorkoutModal
          open={!!openedWorkout}
          workout={openedWorkout}
          onClose={() => setOpenedWorkout(undefined)}
          mode="view"
          showComments
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexGrow: 1,
  },
  filterOptionList: {
    flexDirection: 'row',
    margin: 8,
  },
  filterOption: {
    backgroundColor: 'transparent',
  },
  list: {
    flexBasis: 0,
  },
})

export default observer(WorkoutsReview)
