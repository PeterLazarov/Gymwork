import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { ListRenderItemInfo } from '@shopify/flash-list'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Workout } from 'app/db/models'
import WorkoutReviewListItem from './WorkoutReviewListItem'
import WorkoutModal from 'app/components/WorkoutModal'
import {
  Icon,
  IconButton,
  IndicatedScrollList,
  Text,
  spacing,
  useColors,
} from 'designSystem'
import { searchString } from 'app/utils/string'
import WorkoutsFilterModal, {
  FilterForm,
  applyWorkoutFilter,
  isFilterEmpty,
} from './WorkoutsFilterModal'

const WorkoutsReview: React.FC = () => {
  const { workoutStore } = useStores()

  const [filterString, setFilterString] = useState('')
  const [filter, setFilter] = useState<FilterForm>({})
  const filterEmpty = isFilterEmpty(filter)

  function filterWorkout(workout: Workout) {
    const modalFilterPassed = applyWorkoutFilter(filter, workout)

    const notesFilterPassed =
      filterString === '' ||
      (workout.notes !== '' &&
        searchString(filterString, word =>
          workout.notes.toLowerCase().includes(word)
        ))

    return modalFilterPassed && notesFilterPassed
  }

  const filteredWorkouts = useMemo(() => {
    return workoutStore.sortedReverseWorkouts.filter(filterWorkout)
  }, [workoutStore.workouts, filter, filterString])

  const [openedWorkout, setOpenedWorkout] = useState<Workout | undefined>()
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const renderItem = ({ item }: ListRenderItemInfo<Workout>) => {
    return (
      <>
        <WorkoutReviewListItem
          workout={item}
          onPress={() => setOpenedWorkout(item)}
        />
      </>
    )
  }

  const colors = useColors()
  const styles = makeStyles(colors)

  return (
    <>
      <View style={styles.screen}>
        <Searchbar
          placeholder={translate('search')}
          onChangeText={setFilterString}
          value={filterString}
          mode="bar"
          right={() => (
            <IconButton onPress={() => setFilterModalOpen(true)}>
              {!filterEmpty && <Icon icon="filter" />}
              {filterEmpty && <Icon icon="filter-outline" />}
            </IconButton>
          )}
          style={{ borderRadius: 0 }}
        />
        {filteredWorkouts.length > 0 ? (
          <>
            <IndicatedScrollList
              data={filteredWorkouts}
              renderItem={renderItem}
              keyExtractor={workout => `${workout.date}_${workout.guid}`}
            />
            <View style={styles.workoutCount}>
              <Text>
                {translate('workoutsCount', {
                  count: filteredWorkouts.length,
                })}
              </Text>
            </View>
          </>
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
      <WorkoutsFilterModal
        open={filterModalOpen}
        closeModal={() => setFilterModalOpen(false)}
        applyFilter={setFilter}
      />
    </>
  )
}
const makeStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      display: 'flex',
      flexGrow: 1,
    },
    filterOptionList: {
      flexDirection: 'row',
      margin: spacing.xs,
    },
    filterOption: {
      backgroundColor: 'transparent',
    },
    list: {
      flexBasis: 0,
      // backgroundColor:
    },
    workoutCount: {
      alignItems: 'center',
      paddingVertical: spacing.xxs,
      backgroundColor: colors.surfaceVariant,
    },
  })

export default observer(WorkoutsReview)
